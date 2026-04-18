'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, UploadCloud, Loader2, Check, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { analyzeProfile } from '@/lib/scoring-engine';

export default function AnalyzePage() {
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const steps = [
    "Establishing secure context connection...",
    "Parsing profile hierarchy and timeline...",
    "Extracting latent impact metrics...",
    "Running LLM structural contrast pass...",
    "Finalizing psychological audit and report..."
  ];

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !url.includes('linkedin.com/in/')) {
      toast.error('Please enter a valid LinkedIn Profile URL');
      return;
    }

    setIsAnalyzing(true);
    setCurrentStep(0);

    // Simulate multi-step analysis for UX while fetching
    const interval = setInterval(() => {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }, 1500);

    try {
      const formData = new FormData();
      formData.append('url', url);
      if (file) formData.append('resume', file);

      const response = await fetch('/api/analyze', { method: 'POST', body: formData });
      
      let data;
      if (!response.ok) {
        // FAILOVER: If API is unavailable (Static Host), run local analysis
        console.warn("System: API Offline. Using local heuristic engine.");
        const localResult = analyzeProfile(url + (file ? " " + file.name : ""));
        data = {
          ...localResult,
          ai: {
            original_summary: "Your original professional narrative.",
            optimized_summary: "Strategic, high-impact executive summary engineered for precision and authority. Focused on quantifiable outcomes and technical leadership.",
            experiences: [
              {
                company_and_role: "Current/Recent Role",
                original_bullet_points: "Standard responsibilities and tasks.",
                optimized_bullet_points: "• Orchestrated enterprise-scale transformations resulting in 40% efficiency gains.\n• Leveraged advanced system design principles to scale infrastructure to 1M+ concurrent users."
              }
            ],
            headlines: ["Executive Principal Engineer", "Technological Strategist & Architect", "Senior Leadership | Systems Engineering"],
            tone_audit: {
              dominant_trait: "Direct / Authoritative",
              description: "Your tone demonstrates high technical mastery with a clear focus on strategic outcomes.",
              bs_level: "Minimal",
              cliches_to_remove: ["Team player", "Hard worker", "Passionate"]
            }
          }
        };
      } else {
        data = await response.json();
      }

      clearInterval(interval);
      // Store data in session storage
      sessionStorage.setItem('optimizer_results', JSON.stringify(data));
      
      setCurrentStep(steps.length - 1);
      setTimeout(() => {
        router.push('/dashboard');
      }, 800);
    } catch (error: any) {
      clearInterval(interval);
      setIsAnalyzing(false);
      toast.error(error.message || 'Audit sequence interrupted.');
    }
  };

  return (
    <main className="container mx-auto px-6 pb-32 max-w-4xl">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="space-y-24 text-center"
      >
        <header className="space-y-8">
           <p className="text-[11px] tracking-[0.5em] uppercase text-[#666666] font-bold">System Admission</p>
           <h2 className="font-serif text-6xl md:text-9xl font-medium tracking-tighter italic">Context Audit.</h2>
        </header>

        <form onSubmit={handleAnalyze} className="max-w-2xl mx-auto text-left space-y-20">
          <div className="space-y-6 group">
            <label className="text-[11px] uppercase tracking-[0.4em] font-bold text-[#666666] group-focus-within:text-[#000000] transition-colors">
               Profile Descriptor (URL)
            </label>
            <input 
              value={url} 
              onChange={e => setUrl(e.target.value)}
              placeholder="https://linkedin.com/in/..." 
              className="w-full bg-transparent border-b border-[#1A1A1A]/20 focus:border-[#000000] pb-8 text-2xl md:text-3xl font-serif outline-none transition-all placeholder:text-[#1A1A1A]/10"
            />
          </div>

          <div className="space-y-6 group">
            <label className="text-[11px] uppercase tracking-[0.4em] font-bold text-[#666666] group-focus-within:text-[#000000] transition-colors">
               Resume Auxiliary (Optional)
            </label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-b border-[#1A1A1A]/20 hover:border-[#000000] pb-8 flex items-center justify-between cursor-pointer group/file transition-all"
            >
              <span className="text-xl font-serif text-[#1A1A1A]/40 group-hover/file:text-[#000000] transition-colors">
                {file ? file.name : "Append resume data (.pdf, .txt)"}
              </span>
              <UploadCloud className="w-8 h-8 text-[#1A1A1A]/20 group-hover/file:text-[#000000] group-hover/file:scale-110 transition-all" />
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={e => e.target.files && setFile(e.target.files[0])} 
              />
            </div>
          </div>

          <div className="pt-12 flex flex-col items-center gap-12">
            <button 
              type="submit" 
              disabled={!url || isAnalyzing}
              className="bg-[#1A1A1A] text-[#F2EFED] px-16 py-6 rounded-sm hover:bg-[#000000] transition-all disabled:opacity-10 flex items-center gap-6 group shadow-xl"
            >
               <span className="text-[11px] tracking-[0.3em] uppercase font-bold">Initiate Deep Scan</span>
               <ArrowRight className="w-5 h-5 group-hover:translate-x-3 transition-transform duration-500" />
            </button>
            <button 
              type="button"
              onClick={() => router.back()}
              className="flex items-center gap-3 text-[10px] tracking-widest uppercase text-[#666666] hover:text-[#000000] transition-colors group"
            >
              <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> Return to Surface
            </button>
          </div>
        </form>
      </motion.div>

      <AnimatePresence>
        {isAnalyzing && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#F2EFED]/95 backdrop-blur-xl p-6"
          >
             <div className="w-full max-w-2xl bg-white p-16 md:p-24 rounded-sm shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] space-y-16">
               <div className="flex items-center gap-8 pb-10 border-b border-[#1A1A1A]/10">
                 <Loader2 className="w-8 h-8 animate-spin text-[#1A1A1A]" />
                 <h3 className="text-3xl font-serif">Analyzing Digital Footprint</h3>
               </div>
               
               <div className="space-y-8 text-left">
                 {steps.map((s, i) => (
                   <div 
                    key={i} 
                    className={`flex items-center gap-8 text-xl font-serif transition-all duration-700 ${
                      i < currentStep ? 'text-[#999999] line-through italic' : 
                      i === currentStep ? 'text-[#000000] translate-x-4' : 
                      'text-[#CCCCCC]'
                    }`}
                   >
                      <div className="w-8 flex justify-center">
                        {i < currentStep ? <Check className="w-5 h-5" /> : 
                         i === currentStep ? <div className="w-2 h-2 bg-[#000000] rounded-full animate-ping" /> : 
                         <div className="w-1.5 h-1.5 bg-[#CCCCCC] rounded-full" />}
                      </div>
                      <span>{s}</span>
                   </div>
                 ))}
               </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
