'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-[#F2EFED]/80 backdrop-blur-md py-4 shadow-sm' : 'bg-transparent py-8'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 bg-[#1A1A1A] rounded-sm flex items-center justify-center group-hover:rotate-90 transition-transform duration-500">
             <div className="w-1.5 h-1.5 bg-[#F2EFED] rounded-full"></div>
          </div>
          <span className="font-serif text-2xl tracking-tight">LinkOptimizer.</span>
        </Link>
        <div className="hidden md:flex items-center gap-12 text-[11px] tracking-[0.3em] uppercase font-bold text-[#666666]">
          <Link href="/analyze" className="hover:text-[#000000] transition-colors">Start Audit</Link>
          <Link href="/how-it-works" className="hover:text-[#000000] transition-colors">Methodology</Link>
          <Link href="/pricing" className="hover:text-[#000000] transition-colors">Enterprise</Link>
        </div>
        <Link href="/analyze" className="bg-[#1A1A1A] text-[#F2EFED] px-8 py-3 rounded-sm text-[10px] tracking-widest uppercase hover:bg-[#000000] transition-all">
          Initiate
        </Link>
      </div>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-[#F2EFED] py-24">
      <div className="container mx-auto px-6 grid md:grid-cols-4 gap-16">
        <div className="col-span-2 space-y-8">
          <h3 className="font-serif text-4xl italic">Optimized to the <br/>absolute precision.</h3>
          <p className="max-w-md text-[#666666] leading-relaxed">Advanced structural extraction and psychological tone audits for LinkedIn. Optimize your professional footprint with LLM-engineered narratives.</p>
        </div>
        <div className="space-y-6">
          <h4 className="text-[11px] tracking-widest uppercase font-bold text-[#F2EFED]">Navigation</h4>
          <ul className="space-y-4 text-[#666666] text-sm">
            <li><Link href="/analyze" className="hover:text-[#F2EFED]">Analyze Profile</Link></li>
            <li><Link href="/how-it-works" className="hover:text-[#F2EFED]">How it Works</Link></li>
            <li><Link href="/pricing" className="hover:text-[#F2EFED]">Pricing</Link></li>
          </ul>
        </div>
        <div className="space-y-6">
          <h4 className="text-[11px] tracking-widest uppercase font-bold text-[#F2EFED]">Legal</h4>
          <ul className="space-y-4 text-[#666666] text-sm">
            <li><Link href="/privacy" className="hover:text-[#F2EFED]">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-[#F2EFED]">Terms of Service</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
