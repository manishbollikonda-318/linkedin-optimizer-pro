'use client';

import { motion } from 'framer-motion';
import { ArrowRight, BrainCircuit, ScanSearch, LineChart, ShieldCheck, Zap, Layers } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <main className="min-h-screen bg-[#F2EFED] text-[#1A1A1A]">
      <section className="container mx-auto px-6 pt-32 pb-48">
        <motion.div 
          variants={containerVariants} 
          initial="hidden" 
          animate="visible" 
          className="max-w-[1400px] mx-auto text-center"
        >
          <motion.div variants={itemVariants} className="flex justify-center mb-16">
            <span className="text-[10px] tracking-[0.5em] uppercase font-bold border border-black/10 px-8 py-3 rounded-full flex items-center gap-3 bg-white/50 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 bg-black rounded-full animate-pulse"></span>
              Strategic AI Deployment V1.2.4
            </span>
          </motion.div>

          <motion.h1 variants={itemVariants} className="font-serif text-7xl md:text-[14rem] font-medium tracking-[-0.03em] leading-[0.8] mb-20 text-[#000000]">
            The New <br />
            <span className="italic relative inline-block group">
              Benchmark.
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-black scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 origin-left"></span>
            </span>
          </motion.h1>

          <motion.p variants={itemVariants} className="font-sans text-xl md:text-3xl text-[#444444] mb-24 max-w-4xl mx-auto leading-relaxed font-light">
            An uncompromising, executive-level audit for your professional narrative. We strip away the trivial to reveal high-impact strategic architecture.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col md:flex-row items-center justify-center gap-12">
            <Link 
              href="/analyze" 
              className="group relative bg-[#1A1A1A] text-[#F2EFED] px-20 py-8 rounded-sm hover:shadow-[0_60px_100px_-30px_rgba(0,0,0,0.5)] transition-all duration-1000 overflow-hidden transform hover:-translate-y-2"
            >
              <span className="relative z-10 text-[11px] tracking-[0.6em] uppercase font-bold flex items-center gap-6">
                Initiate Audit <ArrowRight className="w-6 h-6 group-hover:translate-x-4 transition-transform duration-700" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </Link>
          </motion.div>

          {/* Feature Grid */}
          <div className="mt-72 grid md:grid-cols-2 xl:grid-cols-4 gap-1px bg-black/10 overflow-hidden border border-black/10 rounded-sm">
            {[
              { icon: ScanSearch, title: 'Deep Extraction', desc: 'Isolating every metric of consequence from your career timeline.' },
              { icon: BrainCircuit, title: 'AI Benchmarking', desc: 'Dynamic contrast against premium, role-specific strategic patterns.' },
              { icon: ShieldCheck, title: 'Tone Authority', desc: 'Evaluating the linguistic weight and leadership posture of your text.' },
              { icon: Layers, title: 'Multi-Layer UX', desc: 'A bespoke, 0-lag interface designed for high-stakes decision making.' }
            ].map((f, i) => (
              <motion.div 
                key={i} 
                variants={itemVariants}
                className="bg-white p-16 space-y-8 hover:bg-[#F9F8F7] transition-colors duration-700 text-left"
              >
                <f.icon className="w-8 h-8 opacity-20" />
                <h3 className="font-serif text-3xl tracking-tight leading-tight uppercase">{f.title}</h3>
                <p className="text-[#666666] leading-relaxed font-light text-lg">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Trust Quote */}
      <section className="bg-black text-white py-48 text-center overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:40px_40px]"></div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.h2 
             initial={{ opacity: 0, scale: 0.95 }}
             whileInView={{ opacity: 1, scale: 1 }}
             transition={{ duration: 1.5 }}
             className="font-serif text-5xl md:text-8xl italic tracking-tighter"
          >
            "Execution is the only credible <br /> benchmark of strategy."
          </motion.h2>
          <div className="mt-12 text-[10px] tracking-[0.8em] uppercase opacity-40">The LinkOptimizer Standard</div>
        </div>
      </section>
    </main>
  );
}
