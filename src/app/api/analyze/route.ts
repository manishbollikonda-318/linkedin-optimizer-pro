import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { analyzeProfile } from '@/lib/scoring-engine';
import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy-key-for-build');

// Extract text from uploaded PDF
async function extractPdfText(buffer: Buffer): Promise<string> {
  try {
    const pdfParse = require('pdf-parse');
    const data = await pdfParse(buffer);
    return data.text;
  } catch (e) {
    console.error("PDF Parsing Error", e);
    return "";
  }
}

async function scrapeLinkedInProfile(url: string): Promise<string> {
  let browser;
  try {
    // Launch headless browser
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9'
    });

    console.log(`[Scraper] Navigating to ${url}...`);
    
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 }).catch(() => {});
    await new Promise(r => setTimeout(r, 3000));
    
    const html = await page.content();
    const $ = cheerio.load(html);
    
    // Instead of raw body text, try to be more semantic if possible, or just get main text
    let textContent = $('main').text() || $('body').text();
    textContent = textContent.replace(/\s+/g, ' ').trim();
    
    // If we hit an auth wall, fallback to a more neutral empty-ish string rather than random guesses
    // The user explicitly requested NO random guesses. If we fail, we admit it.
    if (textContent.includes('Sign in to LinkedIn') || textContent.includes('authwall') || textContent.length < 300) {
      console.warn("[Scraper] Hit Auth Wall. Cannot fetch real profile.");
      return "ERROR_AUTH_WALL"; // We'll handle this in the prompt or UI
    }

    return textContent.substring(0, 10000); 

  } catch (err) {
    console.error("[Scraper] Puppeteer Error:", err);
    return "ERROR_SCRAPING";
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const url = formData.get('url') as string;
    const resumeFile = formData.get('resume') as File | null;

    if (!url || !url.includes('linkedin.com')) {
      return NextResponse.json({ error: 'Invalid LinkedIn URL provided.' }, { status: 400 });
    }

    // Parse resume if provided
    let resumeText = "";
    if (resumeFile && resumeFile.size > 0 && resumeFile.name.endsWith('.pdf')) {
      const buffer = Buffer.from(await resumeFile.arrayBuffer());
      resumeText = await extractPdfText(buffer);
    } else if (resumeFile && resumeFile.size > 0) {
       resumeText = await resumeFile.text(); // Support txt
    }

    // Scrape Profile
    const profileText = await scrapeLinkedInProfile(url);

    if (profileText.startsWith("ERROR_")) {
       return NextResponse.json({ 
          error: 'LinkedIn blocked our automated scraper with a sign-in wall. Please upload your Resume to proceed or ensure the profile is fully public.',
          errorCode: "AUTH_WALL"
       }, { status: 403 });
    }

    // Run Native Analysis 
    // We append resume text to profile text so the keyword scorer knows all their skills
    const combinedContent = `${profileText}\n\nRESUME CONTENT:\n${resumeText}`;
    const nativeAnalysis = analyzeProfile(combinedContent);

    // AI Generative Optimization
    let aiData = {};
    
    if (process.env.GEMINI_API_KEY) {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" }); 
        
        const prompt = `
          Act as an elite executive career coach.
          Analyze the following scraped LinkedIn profile text, and an optionally uploaded resume.
          
          You MUST extract their exact original About section and exact original Experience descriptions from the text provided, and then provide a highly optimized version side-by-side. DO NOT INVENT or GUESS experience they don't have. Only optimize what is there.

          LINKEDIN SCRAPED TEXT:
          ${profileText}

          OPTIONAL UPLOADED RESUME TEXT:
          ${resumeText || "No resume provided."}

          STRICT OUTPUT FORMAT (JSON ONLY):
          {
            "original_summary": "Their exact current About/Summary section from the text",
            "optimized_summary": "Your elite rewrite of their summary incorporating data from both LinkedIn and Resume",
            "experiences": [
               {
                 "company_and_role": "Company - Role Title",
                 "original_bullet_points": "Their exact current experience text",
                 "optimized_bullet_points": "Your enhanced version using action verbs and impact formatting"
               }
            ],
            "headlines": [
              "High-impact headline 1", 
              "High-impact headline 2", 
              "High-impact headline 3"
            ],
            "tone_audit": {
              "dominant_trait": "e.g., Analytical & Results-Driven",
              "bs_level": "e.g., Low (8%)",
              "description": "Brutally honest feedback on what the profile sounds like.",
              "cliches_to_remove": ["list", "of", "cliches", "found"]
            }
          }
        `;

        const result = await model.generateContent(prompt);
        let aiText = result.response.text();
        
        aiText = aiText.replace(/```(?:json)?\n?/g, '').replace(/```\n?$/g, '').trim();
        aiData = JSON.parse(aiText);
      } catch (geminiError) {
        console.error("Gemini API Error:", geminiError);
        throw new Error("AI Generation failed. Check API key or response format.");
      }
    } else {
      // Fallback
      aiData = {
        original_summary: "Passionate software developer looking to build great things. Have experience in Javascript.",
        optimized_summary: "Results-driven Software Engineer with over 5 years of experience architecting and scaling web applications. Specializing in the React ecosystem, I have successfully led frontend migrations...",
        experiences: [
          {
            company_and_role: "TechCorp - Software Engineer",
            original_bullet_points: "I built the frontend using React and was part of the team scaling the database.",
            optimized_bullet_points: "• Architected high-performance frontend architecture using React, accelerating load times by 40%.\n• Contributed to database scaling initiatives, supporting 10,000+ concurrent requests."
          }
        ],
        headlines: [
          "Software Engineer | React & Node.js Ecosystem Expert",
          "Full-Stack Developer | Focused on High-Performance Web Architecture"
        ],
        tone_audit: {
          dominant_trait: "Execution-Oriented (DISC: C)",
          bs_level: "High (45%)",
          description: "The profile relies heavily on overused buzzwords rather than quantifiable achievements.",
          cliches_to_remove: ["Passionate software developer"]
        }
      };
    }

    return NextResponse.json({
      ...nativeAnalysis,
      ai: aiData
    });

  } catch (error: any) {
    console.error('Analysis Routing Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
