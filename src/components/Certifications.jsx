import React from 'react';
import { motion } from 'framer-motion';
import { Award, ExternalLink } from 'lucide-react';
import { RESUME } from '../data';
import { FadeIn, SectionHeader } from './FadeIn';

const Certifications = () => (
  <section id="certifications" className="py-28 relative z-10">
    <div className="section-divider" />
    <div className="max-w-6xl mx-auto px-6 pt-28">
      <SectionHeader label="Credentials" title="Certifications" />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {RESUME.certifications.map((cert, idx) => (
          <FadeIn key={idx} delay={idx * 0.1}>
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              className="glass rounded-2xl p-6 card-hover group relative overflow-hidden h-full flex flex-col"
            >
              {/* Subtle glow top accent */}
              <div
                className="absolute top-0 left-0 right-0 h-[2px] opacity-60"
                style={{ background: `linear-gradient(90deg, transparent, ${cert.color}, transparent)` }}
              />

              {/* Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110"
                style={{ background: `${cert.color}15`, border: `1px solid ${cert.color}30` }}
              >
                <Award size={22} style={{ color: cert.color }} />
              </div>

              {/* Content */}
              <h4 className="text-white font-medium text-sm leading-snug mb-2 flex-grow">{cert.title}</h4>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.04]">
                <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-slate-500">
                  {cert.issuer}
                </span>
                <div
                  className="w-2 h-2 rounded-full opacity-70"
                  style={{ background: cert.color, boxShadow: `0 0 10px ${cert.color}60` }}
                />
              </div>
            </motion.div>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
);

export default Certifications;
