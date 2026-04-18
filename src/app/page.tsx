'use client';

import { motion } from 'framer-motion';
import { ArrowRight, BrainCircuit, ScanSearch, LineChart } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <main className="container mx-auto px-6 pb-32 flex flex-col items-center justify-center text-center">
      <motion.div 
        variants={containerVariants} 
        initial="hidden" 
        animate="visible" 
        className="max-w-6xl w-full"
      >
        <motion.div variants={itemVariants} className="mb-12">
          <span className="font-sans text-[11px] tracking-[0.4em] uppercase text-[#1A1A1A] font-bold bg-[#1A1A1A]/5 px-6 py-2 rounded-full">
            Autonomous Professional Engineering
          </span>
        </motion.div>

        <motion.h1 variants={itemVariants} className="font-serif text-6xl md:text-[10rem] font-medium tracking-tight leading-[0.85] mb-16 text-[#000000]">
          Absolute <br />
          <span className="italic">precision.</span>
        </motion.h1>

        <motion.p variants={itemVariants} className="font-sans text-xl md:text-2xl text-[#333333] mb-20 max-w-3xl mx-auto leading-relaxed">
          Input your LinkedIn URL for a structural and psychological audit. We bypass trivial advice for executive-level engineered results.
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-col md:flex-row items-center justify-center gap-8">
          <Link 
            href="/analyze" 
            className="group relative bg-[#1A1A1A] text-[#F2EFED] px-16 py-6 rounded-sm hover:shadow-2xl transition-all duration-500 overflow-hidden"
          >
            <span className="relative z-10 text-[11px] tracking-[0.3em] uppercase font-bold flex items-center gap-4">
              Initiate Sequence <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </Link>
          <Link href="/how-it-works" className="text-[11px] tracking-[0.3em] uppercase font-bold text-[#666666] hover:text-[#000000] transition-colors border-b border-transparent hover:border-[#000000] pb-1">
            View Methodology
          </Link>
        </motion.div>

        <div className="mt-48 grid md:grid-cols-3 gap-16 text-left border-t border-[#1A1A1A]/5 pt-24">
          <div className="space-y-6">
            <ScanSearch className="w-8 h-8 text-[#1A1A1A]/30" />
            <h3 className="font-serif text-3xl">Context extraction.</h3>
            <p className="text-[#666666] leading-relaxed">Deep analysis of your professional timeline to extract underlying impact metrics often missed by the human eye.</p>
          </div>
          <div className="space-y-6">
            <BrainCircuit className="w-8 h-8 text-[#1A1A1A]/30" />
            <h3 className="font-serif text-3xl">Structural contrast.</h3>
            <p className="text-[#666666] leading-relaxed">Side-by-side engineering of your existing narrative against premium LLM-optimized benchmarks used by executive agents.</p>
          </div>
          <div className="space-y-6">
            <LineChart className="w-8 h-8 text-[#1A1A1A]/30" />
            <h3 className="font-serif text-3xl">Psychological audit.</h3>
            <p className="text-[#666666] leading-relaxed">Evaluation of tone, authority, and the "BS" factor to ensure your digital footprint aligns with top-tier leadership roles.</p>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
