import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, CheckCircle2, Activity, ShieldCheck, GraduationCap, Download } from 'lucide-react';
import { RESUME } from '../data';
import { FadeIn, SectionHeader } from './FadeIn';

const AnimatedCounter = ({ target, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated.current) {
        hasAnimated.current = true;
        const num = parseInt(target);
        const duration = 1500;
        const steps = 40;
        const increment = num / steps;
        let current = 0;
        const timer = setInterval(() => {
          current += increment;
          if (current >= num) {
            setCount(num);
            clearInterval(timer);
          } else {
            setCount(Math.floor(current));
          }
        }, duration / steps);
      }
    }, { threshold: 0.5 });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref} className="counter-value">{count}{suffix}</span>;
};

const About = () => {
  const stats = [
    { title: "Experience", value: "2", suffix: "+", sub: "Years", icon: <Briefcase size={22} /> },
    { title: "Projects", value: "10", suffix: "+", sub: "Completed", icon: <CheckCircle2 size={22} /> },
    { title: "Automation", value: "95", suffix: "%", sub: "Efficiency", icon: <Activity size={22} /> },
    { title: "Certifications", value: "4", suffix: "", sub: "Global Certs", icon: <ShieldCheck size={22} /> }
  ];

  return (
    <section id="about" className="py-28 relative z-10">
      <div className="section-divider" />
      <div className="max-w-6xl mx-auto px-6 pt-28">
        <SectionHeader label="My Intro" title="About Me" />

        <div className="grid md:grid-cols-12 gap-14 items-start">
          {/* Stats grid */}
          <div className="md:col-span-5 grid grid-cols-2 gap-4">
            {stats.map((box, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="glass rounded-2xl p-6 flex flex-col items-center justify-center text-center card-hover group h-full">
                  <div className="text-cyan-400 mb-3 group-hover:scale-110 transition-transform duration-300">{box.icon}</div>
                  <div className="text-2xl font-bold text-white mb-1">
                    <AnimatedCounter target={box.value} suffix={box.suffix} />
                  </div>
                  <p className="text-slate-500 text-[10px] font-mono uppercase tracking-[0.15em]">{box.sub}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Text */}
          <div className="md:col-span-7">
            <FadeIn delay={0.2}>
              <p className="text-slate-300 text-lg leading-relaxed font-light mb-10">
                {RESUME.objective}
              </p>

              <div className="flex items-start gap-5 mb-10 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
                <div className="w-12 h-12 rounded-xl border border-white/10 flex items-center justify-center bg-white/[0.03] flex-shrink-0">
                  <GraduationCap className="text-cyan-400" size={20} />
                </div>
                <div>
                  <h4 className="text-white font-medium text-lg">{RESUME.education.degree}</h4>
                  <p className="text-slate-400 font-light">{RESUME.education.school}</p>
                  <p className="text-slate-500 text-[11px] font-mono uppercase tracking-[0.15em] mt-1">{RESUME.education.duration}</p>
                </div>
              </div>

              <a href="#" className="inline-flex items-center gap-2 px-6 py-3 bg-white/[0.04] border border-white/10 rounded-full hover:bg-white/[0.08] hover:border-white/20 transition-all text-white font-medium text-sm group">
                <Download size={16} className="group-hover:animate-bounce" /> Download Resume
              </a>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
