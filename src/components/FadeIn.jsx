import React from 'react';
import { motion } from 'framer-motion';

export const FadeIn = ({ children, delay = 0, className = "", direction = "up" }) => {
  const dirs = { up: { y: 30 }, down: { y: -30 }, left: { x: 30 }, right: { x: -30 } };
  const initial = { opacity: 0, ...dirs[direction] };
  const animate = { opacity: 1, x: 0, y: 0 };

  return (
    <motion.div
      initial={initial}
      whileInView={animate}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const SectionHeader = ({ label, title }) => (
  <FadeIn>
    <div className="text-center mb-16">
      <span className="inline-block py-1.5 px-4 border border-cyan-500/20 bg-cyan-500/5 rounded-full text-[11px] font-mono uppercase tracking-[0.2em] text-cyan-400 mb-4">
        {label}
      </span>
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white tracking-tight">
        {title}
      </h2>
    </div>
  </FadeIn>
);
