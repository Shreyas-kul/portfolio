import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { RESUME } from '../data';
import { FadeIn, SectionHeader } from './FadeIn';

const Projects = () => {
  const [filter, setFilter] = useState('All');
  const categories = ['All', ...new Set(RESUME.projects.map(p => p.category))];

  const filteredProjects = filter === 'All'
    ? RESUME.projects
    : RESUME.projects.filter(p => p.category === filter);

  return (
    <section id="projects" className="py-28 relative z-10">
      <div className="section-divider" />
      <div className="max-w-6xl mx-auto px-6 pt-28">
        <SectionHeader label="My Portfolio" title="Recent Deployments" />

        {/* Filter tabs */}
        <FadeIn delay={0.1} className="flex flex-wrap justify-center gap-3 mb-14">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                filter === cat
                  ? 'bg-white text-black shadow-lg shadow-white/10'
                  : 'bg-white/[0.03] border border-white/[0.06] text-slate-400 hover:text-white hover:border-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </FadeIn>

        {/* Project grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((proj) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                key={proj.title}
                className="group"
              >
                <div className="relative glass rounded-2xl p-7 overflow-hidden card-hover flex flex-col justify-between min-h-[300px] h-full">
                  {/* Hover gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.04] via-transparent to-violet-500/[0.04] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Animated border glow on hover */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ boxShadow: 'inset 0 0 0 1px rgba(6, 182, 212, 0.2)' }} />

                  <div className="relative z-10">
                    {/* Category + Duration */}
                    <div className="flex items-center justify-between mb-5">
                      <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full">
                        {proj.category}
                      </span>
                      <span className="text-[10px] font-mono text-slate-600">{proj.duration}</span>
                    </div>

                    {/* Title */}
                    <h4 className="text-xl font-semibold text-white mb-1 group-hover:text-cyan-50 transition-colors">{proj.title}</h4>
                    {proj.subtitle && (
                      <p className="text-slate-500 text-xs font-mono mb-4">{proj.subtitle}</p>
                    )}

                    {/* Description */}
                    <p className="text-slate-400 text-sm font-light leading-relaxed mb-5">{proj.description}</p>

                    {/* Tech tags */}
                    {proj.tags && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {proj.tags.map((tag, i) => (
                          <span key={i} className="tech-tag">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="relative z-10 flex justify-end items-center border-t border-white/[0.04] pt-4 mt-auto">
                    <a href="#" className="flex items-center gap-2 text-slate-500 text-sm hover:text-cyan-400 transition-colors group/link">
                      Review <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default Projects;
