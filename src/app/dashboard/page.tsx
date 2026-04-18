'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Copy, Check, BarChart3, Search, Zap, Lightbulb } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type DashboardData = {
  score: number;
  metrics: { wordCount: number, actionVerbs: number, readability: string };
  skills: { matched: string[], missing: { name: string, priority: string }[] };
  ai: {
    original_summary: string;
    optimized_summary: string;
    experiences: Array<{
      company_and_role: string;
      original_bullet_points: string;
      optimized_bullet_points: string;
    }>;
    headlines: string[];
    tone_audit: {
      dominant_trait: string;
      description: string;
      bs_level: string;
      cliches_to_remove: string[];
    }
  }
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [activeTab, setActiveTab] = useState('comparison');
  const [copiedId, setCopiedId] = useState<string | number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const raw = sessionStorage.getItem('optimizer_results');
    if (!raw) {
      router.push('/analyze');
      return;
    }
    const parsed = JSON.parse(raw);
    setData({
      score: parsed.score || 0,
      metrics: { 
        wordCount: parsed.metrics?.wordCount || 0, 
        actionVerbs: parsed.metrics?.actionVerbsCount || 0, 
        readability: parsed.metrics?.readabilityScore || "N/A" 
      },
      skills: { 
        matched: parsed.matchedKeywords || [], 
        missing: parsed.missingKeywords?.map((k: string) => ({ name: k, priority: 'High' })) || [] 
      },
      ai: {
        original_summary: parsed.ai?.original_summary || "Unavailable",
        optimized_summary: parsed.ai?.optimized_summary || "Generation failed",
        experiences: parsed.ai?.experiences || [],
        headlines: parsed.ai?.headlines || [],
        tone_audit: {
          dominant_trait: parsed.ai?.tone_audit?.dominant_trait || "Unknown",
          description: parsed.ai?.tone_audit?.description || "Missing description",
          bs_level: parsed.ai?.tone_audit?.bs_level || "Unknown",
          cliches_to_remove: parsed.ai?.tone_audit?.cliches_to_remove || []
        }
      }
    });
  }, [router]);

  const copy = (text: string, id: string | number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('System: Text Captured.');
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!data) return null;

  return (
    <main className="p-6 md:p-16 max-w-[1400px] mx-auto space-y-32 mb-40">
      <motion.header 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#1A1A1A]/10 pb-16 gap-12"
      >
        <div className="flex items-center gap-12">
          <button onClick={() => router.push('/analyze')} className="p-4 hover:bg-[#1A1A1A] hover:text-[#F2EFED] rounded-sm border border-black/10 transition-all group">
            <ArrowLeft className="group-hover:-translate-x-2 transition-transform" />
          </button>
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-serif italic">Deep Analysis Report.</h1>
            <p className="text-[10px] tracking-[0.4em] uppercase opacity-40">Profile UID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
          </div>
        </div>
        <div className="flex gap-8 text-[11px] tracking-widest uppercase font-bold">
           <button onClick={() => router.push('/analyze')} className="text-[#666666] hover:text-[#000000] border-b border-transparent hover:border-black transition-all">New Audit</button>
           <button className="bg-[#1A1A1A] text-[#F2EFED] px-8 py-3 rounded-sm hover:bg-[#000000] transition-colors">Export .PDF</button>
        </div>
      </motion.header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 items-stretch">
         <div className="relative flex flex-col items-center justify-center p-12 bg-black/5 rounded-sm group overflow-hidden border border-black/5">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-[12rem] md:text-[14rem] font-serif leading-none tracking-tighter"
            >
              {data.score}
            </motion.div>
            <p className="text-[10px] tracking-[0.6em] uppercase font-bold opacity-30 mt-4">Global Audit Score</p>
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-black/20 to-transparent"></div>
         </div>

         <div className="p-10 border border-black/10 rounded-sm flex flex-col justify-between hover:bg-white transition-all duration-700 shadow-sm hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] group">
            <Zap className="w-6 h-6 text-yellow-600 transition-transform group-hover:rotate-[20deg] group-hover:scale-110" />
            <div className="space-y-4">
              <span className="text-8xl font-serif leading-none block tracking-tighter">{data.metrics.actionVerbs}</span>
              <p className="text-[10px] tracking-widest uppercase text-[#666666] font-bold border-l border-black/10 pl-3">Impulse Verbs</p>
            </div>
         </div>

         <div className="p-10 border border-black/10 rounded-sm flex flex-col justify-between hover:bg-white transition-all duration-700 shadow-sm hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] group relative overflow-hidden">
            <Search className="w-6 h-6 text-[#666666] transition-transform group-hover:scale-125 duration-500" />
            <div className="space-y-4">
              <span className="text-2xl md:text-3xl font-serif leading-tight uppercase italic break-words block tracking-tight text-[#1A1A1A]">
                {data.metrics.readability}
              </span>
              <p className="text-[10px] tracking-widest uppercase text-[#666666] font-bold border-l border-black/10 pl-3">Readability Audit</p>
            </div>
            <div className="absolute top-0 right-0 p-2 opacity-5">
              <div className="w-12 h-12 border-t border-r border-black"></div>
            </div>
         </div>

         <div className="p-10 border border-black/10 rounded-sm flex flex-col justify-between hover:bg-white transition-all duration-700 shadow-sm hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] group">
            <BarChart3 className="w-6 h-6 text-[#666666] transition-transform group-hover:-translate-y-2 duration-500" />
            <div className="space-y-4">
              <span className="text-8xl font-serif leading-none block tracking-tighter">{data.metrics.wordCount}</span>
              <p className="text-[10px] tracking-widest uppercase text-[#666666] font-bold border-l border-black/10 pl-3">Total Depth</p>
            </div>
         </div>
      </section>

      <div className="w-full">
        <div className="sticky top-28 z-40 bg-[#F2EFED]/90 backdrop-blur-xl flex h-20 border-b border-[#1A1A1A]/10 w-full overflow-x-auto hide-scrollbar gap-16 items-center">
          {['comparison', 'skills', 'headlines', 'tone'].map(v => (
            <button 
              key={v} 
              onClick={() => setActiveTab(v)} 
              className={`capitalize font-bold tracking-[0.3em] text-[11px] px-0 h-full border-b-2 transition-all ${activeTab === v ? 'border-[#000000] text-[#000000]' : 'border-transparent text-[#999999] hover:text-[#000000]'}`}
            >
               {v === 'comparison' ? 'Optimized Summary' : v}
            </button>
          ))}
        </div>

        <div className="pt-24 min-h-[600px]">
          {activeTab === 'comparison' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-32">
              <div className="grid lg:grid-cols-2 gap-32">
                 <div className="space-y-10">
                   <div className="flex items-center gap-4 text-[#999999]"><div className="w-8 h-[1px] bg-current"></div><span className="text-[10px] tracking-widest uppercase font-bold">Original Submission</span></div>
                   <p className="text-2xl font-serif leading-relaxed text-[#444444] whitespace-pre-wrap">{data.ai.original_summary}</p>
                 </div>
                 <div className="space-y-10 relative group">
                    <div className="absolute -left-12 top-0 bottom-0 w-[1px] bg-black opacity-10"></div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4 text-black"><div className="w-8 h-[1px] bg-current"></div><span className="text-[10px] tracking-widest uppercase font-bold">AI Engineered Revision</span></div>
                      <button onClick={() => copy(data.ai.optimized_summary, 'sum')} className="p-3 bg-white border border-black/5 hover:bg-black hover:text-white transition-all rounded-sm">
                        {copiedId === 'sum' ? <Check size={14}/> : <Copy size={14}/>}
                      </button>
                    </div>
                    <p className="text-2xl font-serif leading-relaxed text-[#000000] whitespace-pre-wrap italic">{data.ai.optimized_summary}</p>
                 </div>
              </div>
              
              {data.ai.experiences.map((exp, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 30 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true }}
                  className="space-y-16 border-t border-[#1A1A1A]/10 pt-24"
                >
                   <h3 className="text-4xl font-serif italic text-black/40">{exp.company_and_role}</h3>
                   <div className="grid lg:grid-cols-2 gap-32">
                      <div className="space-y-8"><span className="text-[10px] tracking-widest uppercase opacity-40 font-bold">Current State</span><p className="text-lg leading-loose opacity-60 whitespace-pre-wrap pl-6 border-l border-black/5">{exp.original_bullet_points}</p></div>
                      <div className="space-y-8 group relative">
                        <div className="flex justify-between items-center">
                           <span className="text-[10px] tracking-widest uppercase font-bold text-black border-l-2 border-black pl-4">Engineered Framework</span>
                           <button onClick={() => copy(exp.optimized_bullet_points, i)} className="p-3 bg-white border border-black/5 hover:bg-black hover:text-white transition-all rounded-sm opacity-0 group-hover:opacity-100">
                             {copiedId === i ? <Check size={14}/> : <Copy size={14}/>}
                           </button>
                        </div>
                        <p className="text-lg leading-loose text-black whitespace-pre-wrap pl-6">{exp.optimized_bullet_points}</p>
                      </div>
                   </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'skills' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-2 gap-32">
               <div className="space-y-12">
                 <span className="text-[11px] tracking-widest uppercase font-bold border-b-2 border-green-600 pb-2">Verified Skill Matches</span>
                 <div className="flex flex-wrap gap-4 pt-8">
                   {data.skills.matched.map((s: string) => (
                    <div key={s} className="px-6 py-3 rounded-sm border border-black/10 text-xs tracking-[0.2em] uppercase hover:bg-black hover:text-white transition-all cursor-default">{s}</div>
                   ))}
                 </div>
               </div>
               <div className="space-y-12">
                 <span className="text-[11px] tracking-widest uppercase font-bold border-b-2 border-red-600 pb-2">Structural Gaps Identified</span>
                 <div className="space-y-6 pt-8">
                   {data.skills.missing.map((s: any) => (
                    <div key={s.name} className="flex justify-between items-center group py-4 border-b border-black/5">
                      <span className="font-serif text-2xl group-hover:translate-x-4 transition-transform duration-500">{s.name}</span>
                      <span className="text-[9px] text-red-600 tracking-[0.4em] uppercase font-bold">CRITICAL GAP</span>
                    </div>
                   ))}
                 </div>
               </div>
            </motion.div>
          )}

          {activeTab === 'headlines' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-16">
               <span className="text-[11px] tracking-widest uppercase font-bold">Executive Variant Benchmarks</span>
               <div className="divide-y divide-black/10">
                 {data.ai.headlines.map((hl, i) => (
                   <div key={i} className="group flex justify-between items-center py-16 hover:bg-white transition-all px-8 -mx-8">
                      <p className="text-4xl md:text-5xl font-serif text-[#444444] group-hover:text-black group-hover:italic transition-all">{hl}</p>
                      <button onClick={() => copy(hl, i)} className="p-4 bg-black text-white rounded-sm opacity-0 group-hover:opacity-100 transition-all transform translate-x-10 group-hover:translate-x-0">
                        {copiedId === i ? <Check size={18}/> : <Copy size={18}/>}
                      </button>
                   </div>
                 ))}
               </div>
            </motion.div>
          )}

          {activeTab === 'tone' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid lg:grid-cols-2 gap-32">
               <div className="space-y-24">
                 <div className="space-y-10">
                   <span className="text-[11px] tracking-widest uppercase font-bold">Psychological Disposition</span>
                   <p className="text-5xl md:text-6xl font-serif italic leading-tight text-[#1A1A1A]">{data.ai.tone_audit.description}</p>
                 </div>
                 <div className="space-y-6">
                   <span className="text-[11px] tracking-widest uppercase font-bold">BS Factor Matrix</span>
                   <div className="text-[12rem] font-serif leading-none text-red-600 tracking-tighter">{data.ai.tone_audit.bs_level}</div>
                 </div>
               </div>
               <div className="space-y-16 lg:border-l border-black/10 lg:pl-32">
                 <div className="space-y-12">
                   <span className="text-[11px] tracking-widest uppercase font-bold">Cliches Flagged for Deletion</span>
                   <div className="space-y-8 pt-6">
                     {data.ai.tone_audit.cliches_to_remove.map(c => (
                      <div key={c} className="flex items-center gap-8 group">
                         <div className="w-6 h-6 border border-red-600 rounded-full flex items-center justify-center text-red-600 text-[10px] font-bold">X</div>
                         <p className="text-3xl font-serif line-through opacity-30 group-hover:opacity-100 transition-opacity">{c}</p>
                      </div>
                     ))}
                   </div>
                 </div>
                 <div className="p-12 bg-black text-white space-y-8 rounded-sm">
                   <Lightbulb className="w-8 h-8 text-yellow-400" />
                   <h4 className="text-2xl font-serif italic">Audit Insight.</h4>
                   <p className="text-sm leading-loose opacity-60">Your profile currently exhibits a high degree of corporate abstraction. Eliminate the flagged terms to establish more immediate authority.</p>
                 </div>
               </div>
            </motion.div>
          )}
        </div>
      </div>
    </main>
  );
}
