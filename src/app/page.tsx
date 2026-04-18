'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, BrainCircuit, ScanSearch, LineChart, 
  Loader2, Check, ArrowLeft, Mail, Copy, 
  UploadCloud, FileText, Zap, Search, AlertTriangle, 
  BarChart3, Lightbulb, Brain
} from 'lucide-react';
import { toast } from 'sonner';

// --- Types ---
type DashboardData = {
  score: number;
  metrics: any;
  skills: any;
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

// --- Helper Functions ---
function CircularProgress({ value, label, size = 120, strokeWidth = 2 }: { value: number, label: string, size?: number, strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle cx={size/2} cy={size/2} r={radius} stroke="currentColor" strokeWidth={strokeWidth} fill="transparent" className="text-[#1A1A1A] opacity-10" />
          <motion.circle
            cx={size/2} cy={size/2} r={radius} stroke="currentColor" strokeWidth={strokeWidth} fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="square"
            className="text-[#000000]"
          />
        </svg>
        <span className="absolute text-5xl font-serif text-[#000000]">{value}</span>
      </div>
      <span className="mt-4 text-[11px] tracking-[0.3em] uppercase text-[#1A1A1A] font-sans font-medium">{label}</span>
    </div>
  );
}

// --- Main Engine ---
export default function UniversalOptimizer() {
  const [view, setView] = useState<'landing' | 'analyze' | 'dashboard'>('landing');
  const [activeTab, setActiveTab] = useState('comparison');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<DashboardData | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const steps = ["Establishing connection...", "Parsing contextual data...", "Deep text extraction...", "AI structural contrast...", "Finalizing report format"];

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !url.includes('linkedin.com/in/')) {
      toast.error('Please enter a valid LinkedIn Profile URL');
      return;
    }
    setIsAnalyzing(true);
    setCurrentStep(0);

    try {
      const stepInterval = setInterval(() => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1)), 2000);
      const formData = new FormData();
      formData.append('url', url);
      if (file) formData.append('resume', file);

      const response = await fetch('/api/analyze', { method: 'POST', body: formData });
      clearInterval(stepInterval);

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Deep scan failed');
      }

      const parsed = await response.json();
      setData({
        score: parsed.score || 0,
        metrics: { wordCount: parsed.metrics?.wordCount || 0, actionVerbs: parsed.metrics?.actionVerbsCount || 0, readability: parsed.metrics?.readabilityScore || "N/A" },
        skills: { matched: parsed.matchedKeywords || [], missing: parsed.missingKeywords?.map((k: string) => ({ name: k, type: 'Technical', priority: 'High' })) || [] },
        ai: {
          original_summary: parsed.ai?.original_summary || "Original summary not available",
          optimized_summary: parsed.ai?.optimized_summary || "Optimized summary generation failed",
          experiences: parsed.ai?.experiences || [],
          headlines: parsed.ai?.headlines || ["AI Headline generation failed"],
          tone_audit: {
            dominant_trait: parsed.ai?.tone_audit?.dominant_trait || "Unknown",
            description: parsed.ai?.tone_audit?.description || "Analysis missing",
            bs_level: parsed.ai?.tone_audit?.bs_level || "Unknown",
            cliches_to_remove: parsed.ai?.tone_audit?.cliches_to_remove || []
          }
        }
      });
      
      setCurrentStep(steps.length - 1);
      setTimeout(() => { setIsAnalyzing(false); setView('dashboard'); }, 800);
    } catch (error: any) {
      setIsAnalyzing(false);
      toast.error(error.message || 'An unexpected analysis error occurred.');
    }
  };

  const copyToClipboard = (text: string, id: string | number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

  return (
    <div className="min-h-screen bg-[#F2EFED] text-[#000000] selection:bg-[#1A1A1A] selection:text-[#F2EFED] transition-colors duration-700">
      
      {view === 'landing' && (
        <main className="container mx-auto px-6 pt-32 pb-32 flex flex-col items-center justify-center min-h-screen text-center">
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-6xl">
            <motion.div variants={itemVariants} className="mb-12"><span className="font-sans text-[11px] tracking-[0.3em] uppercase text-[#1A1A1A] font-medium">System Level Analysis</span></motion.div>
            <motion.h1 variants={itemVariants} className="font-serif text-6xl md:text-[9rem] font-medium tracking-tight leading-[0.9] mb-12 text-[#000000]">Absolute <br /><span className="italic">precision.</span></motion.h1>
            <motion.p variants={itemVariants} className="font-sans text-xl md:text-2xl text-[#333333] mb-16 max-w-3xl mx-auto leading-relaxed">Input your LinkedIn URL for a structural and psychological audit. We bypass trivial advice for executive-level engineered results.</motion.p>
            <motion.div variants={itemVariants}>
              <button onClick={() => setView('analyze')} className="font-sans bg-[#1A1A1A] text-[#F2EFED] px-12 py-5 rounded-sm hover:bg-[#000000] transition-all flex items-center gap-6 group mx-auto">
                <span className="text-[11px] tracking-[0.2em] uppercase">Initiate Sequence</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </button>
            </motion.div>
          </motion.div>
        </main>
      )}

      {view === 'analyze' && (
        <main className="container mx-auto px-6 pt-32 pb-32 max-w-4xl text-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-24">
            <header className="space-y-8">
               <p className="text-[11px] tracking-[0.4em] uppercase text-[#1A1A1A] font-medium">System Entry</p>
               <h2 className="font-serif text-6xl md:text-8xl font-medium tracking-tight">Context Audit.</h2>
            </header>
            <form onSubmit={handleAnalyze} className="max-w-2xl mx-auto text-left space-y-20">
              <div className="space-y-6">
                <label className="text-[11px] uppercase tracking-[0.4em] font-bold">Profile Descriptor (URL)</label>
                <input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://linkedin.com/in/..." className="w-full bg-transparent border-b border-[#1A1A1A]/20 focus:border-[#000000] pb-6 text-3xl font-serif outline-none transition-colors" />
              </div>
              <div className="space-y-6">
                <label className="text-[11px] uppercase tracking-[0.4em] font-bold">Resume Auxiliary (Optional)</label>
                <div onClick={() => fileInputRef.current?.click()} className="border-b border-[#1A1A1A]/20 hover:border-[#000000] pb-6 flex items-center justify-between cursor-pointer group transition-colors">
                  <span className="text-xl font-serif text-[#666666] group-hover:text-[#000000]">{file ? file.name : "Append resume data (.pdf, .txt)"}</span>
                  <UploadCloud className="w-6 h-6 text-[#999999] group-hover:text-[#000000]" /><input type="file" ref={fileInputRef} className="hidden" onChange={e => e.target.files && setFile(e.target.files[0])} />
                </div>
              </div>
              <div className="pt-8 flex justify-center flex-col items-center gap-12">
                <button type="submit" disabled={!url} className="bg-[#1A1A1A] text-[#F2EFED] px-10 py-5 rounded-sm hover:bg-[#000000] transition-colors disabled:opacity-20 flex items-center gap-4 group">
                   <span className="text-[11px] tracking-widest uppercase font-bold">Deep Scan</span><ArrowRight className="w-4 h-4 group-hover:translate-x-1" />
                </button>
                <button type="button" onClick={() => setView('landing')} className="text-[10px] tracking-widest uppercase text-[#666666] hover:text-[#000000]">Return to Surface</button>
              </div>
            </form>
          </motion.div>
          <AnimatePresence>
            {isAnalyzing && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-[#F2EFED] p-6">
                 <div className="w-full max-w-2xl bg-white p-12 md:p-20 rounded-sm shadow-2xl space-y-12">
                   <div className="flex items-center gap-6 pb-8 border-b border-[#1A1A1A]/10"><Loader2 className="w-6 h-6 animate-spin" /><h3 className="text-2xl font-serif">Processing Matrix</h3></div>
                   <div className="space-y-6 text-left">
                     {steps.map((s, i) => (
                       <div key={i} className={`flex items-center gap-6 text-xl font-serif ${i < currentStep ? 'text-[#999999] line-through' : i === currentStep ? 'text-[#000000]' : 'text-[#CCCCCC]'}`}>
                          <div className="w-6 flex justify-center">{i < currentStep ? <Check className="w-4 h-4" /> : i === currentStep ? <div className="w-1.5 h-1.5 bg-[#000000] rounded-full" /> : <div className="w-1 h-1 bg-[#CCCCCC] rounded-full" />}</div><span>{s}</span>
                       </div>
                     ))}
                   </div>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      )}

      {view === 'dashboard' && data && (
        <main className="p-6 md:p-16 max-w-[1400px] mx-auto space-y-32">
          <header className="flex justify-between items-center border-b border-[#1A1A1A]/10 pb-16">
            <div className="flex items-center gap-8">
              <button onClick={() => setView('analyze')} className="p-3 hover:bg-[#1A1A1A]/5 rounded-full border border-black/10"><ArrowLeft size={20}/></button>
              <h1 className="text-4xl font-serif">Deep Analysis Set</h1>
            </div>
            <div className="flex gap-8 text-[11px] tracking-widest uppercase font-bold">
               <button onClick={() => setView('analyze')} className="text-[#666666] hover:text-[#000000]">New Audit</button>
               <button className="border-b border-[#000000]">Export</button>
            </div>
          </header>

          <section className="grid grid-cols-2 lg:grid-cols-4 gap-16 items-end">
             <CircularProgress value={data.score} label="Overall ATS Score" size={180} />
             <div className="space-y-2"><span className="text-8xl font-serif">{data.metrics.actionVerbs}</span><p className="text-[10px] tracking-widest uppercase text-[#666666] pt-4 border-t border-[#1A1A1A]/10">Action Verbs</p></div>
             <div className="space-y-2"><span className="text-6xl font-serif">{data.metrics.readability}</span><p className="text-[10px] tracking-widest uppercase text-[#666666] pt-4 border-t border-[#1A1A1A]/10">Readability</p></div>
             <div className="space-y-2"><span className="text-8xl font-serif">{data.metrics.wordCount}</span><p className="text-[10px] tracking-widest uppercase text-[#666666] pt-4 border-t border-[#1A1A1A]/10">Word Count</p></div>
          </section>

          <div className="w-full">
            <div className="sticky top-0 z-40 bg-[#F2EFED]/90 backdrop-blur-md flex h-16 border-b border-[#1A1A1A]/10 w-full overflow-x-auto hide-scrollbar gap-12">
              {['comparison', 'skills', 'headlines', 'tone'].map(v => (
                <button key={v} onClick={() => setActiveTab(v)} className={`capitalize font-bold tracking-widest text-[11px] px-0 pb-6 rounded-none border-b-2 transition-all ${activeTab === v ? 'border-[#000000] text-[#000000]' : 'border-transparent text-[#666666]'}`}>
                   {v === 'comparison' ? 'Optimization' : v}
                </button>
              ))}
            </div>

            <div className="pt-24 min-h-[500px]">
              {activeTab === 'comparison' && (
                <div className="space-y-32">
                  <div className="grid lg:grid-cols-2 gap-24">
                     <div className="space-y-8"><span className="text-[10px] tracking-widest uppercase font-bold">Original About</span><p className="text-xl font-sans leading-loose text-[#444444] whitespace-pre-wrap">{data.ai.original_summary}</p></div>
                     <div className="space-y-8 border-l border-[#000000] pl-12 relative group"><div className="flex justify-between items-center"><span className="text-[10px] tracking-widest uppercase font-bold">AI Engineered</span><button onClick={() => copyToClipboard(data.ai.optimized_summary, 'sum')} className="opacity-0 group-hover:opacity-100 transition-opacity"><Copy className="w-4 h-4"/></button></div><p className="text-xl font-sans leading-loose text-[#000000] whitespace-pre-wrap">{data.ai.optimized_summary}</p></div>
                  </div>
                  {data.ai.experiences.map((exp, i) => (
                    <div key={i} className="space-y-12 border-t border-[#1A1A1A]/10 pt-24">
                       <h3 className="text-3xl font-serif">{exp.company_and_role}</h3>
                       <div className="grid lg:grid-cols-2 gap-24">
                          <div className="space-y-6"><span className="text-[10px] tracking-widest uppercase opacity-50">Current</span><p className="text-base leading-relaxed opacity-60 whitespace-pre-wrap">{exp.original_bullet_points}</p></div>
                          <div className="space-y-6 border-l border-[#000000] pl-12 group relative"><button onClick={() => copyToClipboard(exp.optimized_bullet_points, i)} className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity"><Copy className="w-4 h-4"/></button><span className="text-[10px] tracking-widest uppercase font-bold">Enhanced Framework</span><p className="text-base leading-relaxed whitespace-pre-wrap">{exp.optimized_bullet_points}</p></div>
                       </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'skills' && (
                <div className="grid md:grid-cols-2 gap-24">
                   <div className="space-y-8"><span className="text-[11px] tracking-widest uppercase font-bold">Verified Matches</span><div className="flex flex-wrap gap-3">{data.skills.matched.map((s: string) => <div key={s} className="px-5 py-2 rounded-sm bg-[#1A1A1A]/5 text-xs tracking-widest uppercase">{s}</div>)}</div></div>
                   <div className="space-y-8 border-l border-[#1A1A1A]/10 pl-12"><span className="text-[11px] tracking-widest uppercase font-bold">Structural Gaps</span><div className="space-y-4">{data.skills.missing.map((s: any) => (<div key={s.name} className="flex justify-between border-b border-[#1A1A1A]/5 pb-4"><span className="font-sans text-lg">{s.name}</span><span className="text-[10px] opacity-30 tracking-widest">HIGH PRIORITY</span></div>))}</div></div>
                </div>
              )}

              {activeTab === 'headlines' && (
                <div className="space-y-12"><span className="text-[11px] tracking-widest uppercase font-bold">Engineered Variants</span><div className="space-y-4">{data.ai.headlines.map((hl, i) => (<div key={i} className="group flex justify-between items-center py-10 border-b border-[#1A1A1A]/10 hover:border-[#000000] transition-colors"><p className="text-4xl font-serif text-[#333333] group-hover:text-[#000000]">{hl}</p><button onClick={() => copyToClipboard(hl, i)} className="opacity-0 group-hover:opacity-100 transition-opacity"><Copy /></button></div>))}</div></div>
              )}

              {activeTab === 'tone' && (
                <div className="grid lg:grid-cols-2 gap-24 font-serif">
                   <div className="space-y-20"><div className="space-y-8"><span className="text-[11px] tracking-widest uppercase font-bold font-sans">Psychological Audit</span><p className="text-4xl leading-snug">{data.ai.tone_audit.description}</p></div><div className="space-y-4"><span className="text-[11px] tracking-widest uppercase font-bold font-sans">Fluff Factor</span><p className="text-9xl">{data.ai.tone_audit.bs_level}</p></div></div>
                   <div className="space-y-12 lg:border-l border-[#1A1A1A]/10 lg:pl-24"><span className="text-[11px] tracking-widest uppercase font-bold font-sans">Clichés to Eliminate</span><div className="space-y-6">{data.ai.tone_audit.cliches_to_remove.map(c => <p key={c} className="text-2xl line-through opacity-40">{c}</p>)}</div></div>
                </div>
              )}
            </div>
          </div>
        </main>
      )}

      <footer className="py-24 border-t border-[#1A1A1A]/5 opacity-30 text-center"><p className="text-[9px] tracking-[0.5em] uppercase">LinkedIn Optimizer Pro | Powered by AI Orchestration</p></footer>
    </div>
  );
}
