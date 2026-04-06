import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, BrainCircuit, Cloud, DatabaseZap, Cpu, GitBranch, Wrench } from 'lucide-react';
import { RESUME } from '../data';
import { FadeIn, SectionHeader } from './FadeIn';

const iconMap = {
  "Languages": <Code2 size={20} />,
  "AI/ML": <BrainCircuit size={20} />,
  "Systems": <Cpu size={20} />,
  "Data": <DatabaseZap size={20} />,
  "Cloud": <Cloud size={20} />,
  "DevOps": <GitBranch size={20} />,
  "Tools": <Wrench size={20} />
};

const colorMap = {
  cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', text: 'text-cyan-400', dot: 'bg-cyan-400', glow: 'hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]' },
  violet: { bg: 'bg-violet-500/10', border: 'border-violet-500/20', text: 'text-violet-400', dot: 'bg-violet-400', glow: 'hover:shadow-[0_0_30px_rgba(139,92,246,0.15)]' },
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', dot: 'bg-emerald-400', glow: 'hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]' },
  amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400', dot: 'bg-amber-400', glow: 'hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]' },
  blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400', dot: 'bg-blue-400', glow: 'hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]' },
  rose: { bg: 'bg-rose-500/10', border: 'border-rose-500/20', text: 'text-rose-400', dot: 'bg-rose-400', glow: 'hover:shadow-[0_0_30px_rgba(244,63,94,0.15)]' },
  teal: { bg: 'bg-teal-500/10', border: 'border-teal-500/20', text: 'text-teal-400', dot: 'bg-teal-400', glow: 'hover:shadow-[0_0_30px_rgba(20,184,166,0.15)]' }
};

const Skills = () => {
  const [active, setActive] = useState(null);

  return (
    <section id="skills" className="py-28 relative z-10">
      <div className="section-divider" />
      <div className="max-w-6xl mx-auto px-6 pt-28">
        <SectionHeader label="My Abilities" title="Technology Stack" />

        {/* Category filter tabs */}
        <FadeIn delay={0.1} className="flex flex-wrap justify-center gap-2 mb-12">
          <button
            onClick={() => setActive(null)}
            className={`px-5 py-2 rounded-full text-xs font-mono uppercase tracking-[0.1em] transition-all ${
              active === null ? 'bg-white text-black' : 'bg-white/[0.03] border border-white/[0.06] text-slate-400 hover:text-white hover:border-white/20'
            }`}
          >
            All
          </button>
          {RESUME.skills.map((group) => {
            const c = colorMap[group.color] || colorMap.cyan;
            return (
              <button
                key={group.category}
                onClick={() => setActive(active === group.category ? null : group.category)}
                className={`px-5 py-2 rounded-full text-xs font-mono uppercase tracking-[0.1em] transition-all ${
                  active === group.category
                    ? `${c.bg} ${c.text} ${c.border} border`
                    : 'bg-white/[0.03] border border-white/[0.06] text-slate-400 hover:text-white hover:border-white/20'
                }`}
              >
                {group.category}
              </button>
            );
          })}
        </FadeIn>

        {/* Skills grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          <AnimatePresence mode="popLayout">
            {RESUME.skills
              .filter(g => !active || g.category === active)
              .map((group, idx) => {
                const c = colorMap[group.color] || colorMap.cyan;
                return (
                  <motion.div
                    layout
                    key={group.category}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FadeIn delay={idx * 0.05} className={`glass rounded-2xl p-7 card-hover ${c.glow} h-full`}>
                      <h4 className="text-white font-medium text-base mb-5 flex items-center gap-3 pb-4 border-b border-white/[0.05]">
                        <span className={c.text}>{iconMap[group.category]}</span>
                        {group.category}
                      </h4>
                      <div className="flex flex-col gap-2.5">
                        {group.items.map((item, i) => (
                          <div key={i} className="flex items-center gap-3 group/skill">
                            <div className={`w-1.5 h-1.5 rounded-full bg-slate-700 group-hover/skill:${c.dot} transition-colors`} />
                            <span className="text-slate-400 font-light text-sm group-hover/skill:text-white transition-colors">{item}</span>
                          </div>
                        ))}
                      </div>
                    </FadeIn>
                  </motion.div>
                );
              })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default Skills;
