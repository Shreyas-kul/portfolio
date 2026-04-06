import React from 'react';
import { motion } from 'framer-motion';
import { Building2, ChevronRight } from 'lucide-react';
import { RESUME } from '../data';
import { FadeIn, SectionHeader } from './FadeIn';

const Experience = () => (
  <section id="experience" className="py-28 relative z-10">
    <div className="section-divider" />
    <div className="max-w-6xl mx-auto px-6 pt-28">
      <SectionHeader label="Career Path" title="Experience" />

      <div className="relative max-w-3xl mx-auto">
        {/* Vertical timeline line */}
        <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[1px]">
          <div className="w-full h-full bg-gradient-to-b from-transparent via-cyan-500/30 to-transparent" />
        </div>

        {RESUME.experience.map((exp, idx) => (
          <FadeIn key={idx} delay={idx * 0.2} className="relative mb-16 last:mb-0">
            <div className={`flex items-start gap-8 ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
              {/* Timeline dot */}
              <div className="absolute left-6 md:left-1/2 -translate-x-1/2 z-10">
                <div className="w-4 h-4 rounded-full bg-cyan-500 border-4 border-[#020204] timeline-dot" />
              </div>

              {/* Card */}
              <div className={`ml-14 md:ml-0 md:w-[calc(50%-2rem)] ${idx % 2 === 0 ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'}`}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="glass rounded-2xl p-7 card-hover group"
                >
                  {/* Duration badge */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full">
                      {exp.duration}
                    </span>
                  </div>

                  {/* Company & Role */}
                  <div className="flex items-start gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center flex-shrink-0">
                      <Building2 size={18} className="text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg leading-tight">{exp.role}</h3>
                      <p className="text-slate-400 text-sm font-light mt-0.5">{exp.company}</p>
                    </div>
                  </div>

                  {/* Bullets */}
                  <ul className="space-y-3">
                    {exp.bullets.map((bullet, i) => (
                      <li key={i} className="flex items-start gap-3 group/item">
                        <ChevronRight size={14} className="text-cyan-500/50 mt-1 flex-shrink-0 group-hover/item:text-cyan-400 transition-colors" />
                        <span className="text-slate-400 text-sm font-light leading-relaxed group-hover/item:text-slate-300 transition-colors">
                          {bullet}
                        </span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
);

export default Experience;
