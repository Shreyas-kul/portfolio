import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

export const ScrollProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return <div className="scroll-progress" style={{ width: `${progress}%` }} />;
};

export const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full glass flex items-center justify-center text-white hover:text-cyan-400 hover:border-cyan-500/30 transition-all shadow-lg shadow-black/30 hover:shadow-cyan-500/10"
        >
          <ArrowUp size={18} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export const Footer = () => (
  <footer className="relative z-10 py-10 border-t border-white/[0.04] text-center bg-[#020204]">
    <div className="max-w-6xl mx-auto px-6 flex flex-col items-center">
      <span className="text-xl font-bold tracking-tighter text-white mb-6">
        SK<span className="text-cyan-400">.</span>
      </span>
      <ul className="flex flex-wrap justify-center gap-6 text-[11px] font-mono uppercase tracking-[0.15em] text-slate-500 mb-8">
        <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
        <li><a href="#experience" className="hover:text-white transition-colors">Experience</a></li>
        <li><a href="#projects" className="hover:text-white transition-colors">Projects</a></li>
        <li><a href="#home" className="hover:text-white transition-colors">AI Hub</a></li>
        <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
      </ul>
      <p className="text-slate-600 text-[10px] font-mono uppercase tracking-[0.15em]">
        © 2026 Shreyas Kulkarni. All rights reserved.
      </p>
    </div>
  </footer>
);
