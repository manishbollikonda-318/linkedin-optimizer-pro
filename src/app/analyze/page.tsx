'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'react-router-dom'; // Using react-router-dom specifically for this component if needed or framer-motion
import { motion as m } from 'framer-motion';
import { ArrowRight, ShieldCheck } from 'lucide-react';

export default function AnalyzePage() {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const router = useRouter();

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    // Artificial delay for premium feel
    setTimeout(() => {
      // Create mockup data
      const data = {
        score: 60,
        metrics: {
          actionVerbs: 12,
          readability: "EXPERT/EXECUTIVE",
          wordCount: 842
        },
        summary: "Your profile exhibits strong high-level keywords, but the structural density is inconsistent for Tier-1 leadership roles. We've optimized the phrasing for impact intensity.",
        skills: ["Strategic Planning", "Cross-functional Leadership", "P&L Management"],
        headlines: [
          "Strategic Operations Leader | Driving Exponential Growth Through Precision Infrastructure",
          "Executive Director of Global Transformation | Architectural Excellence in Professional Narratives"
        ],
        toneAnalysis: {
          authority: 85,
          empathy: 45,
          professionalism: 92
        }
      };
      
      localStorage.setItem('linkedin_audit', JSON.stringify(data));
      router.push('/dashboard');
    }, 2000);
  };

  return (
    <main className="min-h-screen bg-[#F2EFED] flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden">
      {/* Background Micro-Detailing */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="grid grid-cols-12 h-full w-full">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="border-r border-black h-full"></div>
          ))}
        </div>
      </div>

      <m.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-4xl relative z-10"
      >
        <div className="text-center mb-16 space-y-4">
          <div className="text-[10px] tracking-[0.5em] uppercase opacity-40 font-bold mb-8">System Access Portal</div>
          <h1 className="font-serif text-6xl md:text-8xl tracking-tight leading-none mb-6">
            Neural <span className="italic">Link</span> Audit
          </h1>
          <p className="text-xl md:text-2xl text-[#666666] font-light max-w-2xl mx-auto leading-relaxed">
            Input your profile identifier for a total structural deconstruction and strategic optimization.
          </p>
        </div>

        <form onSubmit={handleAnalyze} className="space-y-12">
          <div className="relative group">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="YOUR LINKEDIN URL OR IDENTIFIER"
              className="w-full bg-white border border-black/10 px-10 py-10 rounded-sm text-lg md:text-2xl tracking-[0.2em] uppercase focus:outline-none focus:border-black transition-all duration-700 shadow-sm hover:shadow-xl focus:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] outline-none"
            />
            <div className="absolute right-10 top-1/2 -translate-y-1/2 flex items-center gap-4 opacity-20 group-focus-within:opacity-100 transition-opacity">
               <ShieldCheck className="w-6 h-6" />
               <span className="text-[10px] tracking-widest font-bold hidden sm:block uppercase">Secure Channel</span>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isAnalyzing || !url}
              className="group relative bg-[#1A1A1A] text-white px-20 py-8 rounded-sm overflow-hidden transition-all duration-700 disabled:opacity-30 transform hover:-translate-y-1 active:scale-95"
            >
              <span className="relative z-10 text-[11px] tracking-[0.8em] font-bold uppercase flex items-center gap-6">
                {isAnalyzing ? 'Processing Channel...' : 'Begin Deep Audit'}
              </span>
              <div className="absolute inset-0 bg-[#333333] translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            </button>
          </div>
        </form>

        <div className="mt-20 flex justify-center">
          <button
            onClick={() => router.back()}
            className="text-[10px] tracking-[0.4em] uppercase opacity-30 hover:opacity-100 transition-opacity flex items-center gap-4"
          >
            ← Disconnect Portal
          </button>
        </div>
      </m.div>
    </main>
  );
}
