/**
 * Core Scoring Engine for the LinkedIn Optimizer
 * Implements native TypeScript logic for cost-efficient ATS analysis.
 */

const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'but', 'by', 'for', 'if', 'in', 'into', 'is', 'it', 'no', 'not', 'of', 'on', 'or', 'such', 'that', 'the', 'their', 'then', 'there', 'these', 'they', 'this', 'to', 'was', 'will', 'with'
]);

export interface AnalysisResult {
  score: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  metrics: {
    wordCount: number;
    actionVerbsCount: number;
    readabilityScore: string;
  }
}

// Common tech keywords for semantic matching
const TECH_ENTITIES = [
  'javascript', 'typescript', 'react', 'next.js', 'node.js', 'python', 'java', 'rust', 'go',
  'aws', 'azure', 'gcp', 'kubernetes', 'docker', 'ci/cd', 'frontend', 'backend', 'fullstack',
  'architecture', 'system design', 'graphql', 'sql', 'postgresql', 'mongodb', 'redis',
  'tailwind', 'css', 'html', 'git', 'agile', 'scrum', 'leadership', 'management'
];

export function analyzeProfile(profileText: string, jobDescription?: string): AnalysisResult {
  const profileWords = tokenize(profileText);
  const profileSet = new Set(profileWords);
  
  const metrics = calculateMetrics(profileText, profileWords);
  
  let matchedKeywords: string[] = [];
  let missingKeywords: string[] = [];
  let score = 70; // Baseline score for a complete profile

  if (jobDescription) {
    const jdWords = tokenize(jobDescription);
    const jdSet = new Set(jdWords.filter(w => TECH_ENTITIES.includes(w) || w.length > 3));
    
    jdSet.forEach(word => {
      if (profileSet.has(word)) {
        matchedKeywords.push(word);
      } else {
        missingKeywords.push(word);
      }
    });

    // Match score based on intersection
    const matchPercentage = jdSet.size > 0 
      ? Math.round((matchedKeywords.length / jdSet.size) * 100) 
      : 0;
    
    score = matchPercentage;
  } else {
    // If no JD, score purely on profile health and tech coverage
    matchedKeywords = TECH_ENTITIES.filter(k => profileSet.has(k));
    missingKeywords = TECH_ENTITIES.filter(k => !profileSet.has(k)).sort(() => 0.5 - Math.random()).slice(0, 10); // Randomly suggest some core tech they might be missing
    score = Math.min(100, 60 + matchedKeywords.length * 2);
  }

  return {
    score,
    matchedKeywords,
    missingKeywords: missingKeywords.slice(0, 8), // Top 8 missing
    metrics
  };
}

function tokenize(text: string): string[] {
  return text.toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "")
    .split(/\s+/)
    .filter(word => word.length > 2 && !STOP_WORDS.has(word));
}

function calculateMetrics(text: string, words: string[]) {
  // Simple Readability: Average word length
  const avgLen = words.reduce((acc, curr) => acc + curr.length, 0) / words.length;
  let readability = "Junior";
  if (avgLen > 6.5) readability = "Expert/Executive";
  else if (avgLen > 5.5) readability = "Senior";
  else if (avgLen > 4.5) readability = "Mid-Level";

  // Action verbs (simplified check)
  const actionVerbs = new Set(['led', 'managed', 'built', 'developed', 'architected', 'scaled', 'optimized', 'delivered', 'automated', 'engineered', 'mentored', 'orchestrated']);
  const actionVerbsCount = words.filter(w => actionVerbs.has(w)).length;

  return {
    wordCount: words.length,
    actionVerbsCount,
    readabilityScore: readability
  };
}
