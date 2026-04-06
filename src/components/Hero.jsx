import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MessageSquare, Linkedin, Github, Mail, BrainCircuit } from 'lucide-react';
import { RESUME } from '../data';
import { FadeIn } from './FadeIn';
import RAGChatbot from './RAGChatbot';

const useTypewriter = (words, typingSpeed = 80, deletingSpeed = 40, pauseTime = 2000) => {
  const [text, setText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[wordIndex];
    let timeout;

    if (!isDeleting && text === currentWord) {
      timeout = setTimeout(() => setIsDeleting(true), pauseTime);
    } else if (isDeleting && text === '') {
      setIsDeleting(false);
      setWordIndex((prev) => (prev + 1) % words.length);
    } else {
      timeout = setTimeout(() => {
        setText(currentWord.substring(0, text.length + (isDeleting ? -1 : 1)));
      }, isDeleting ? deletingSpeed : typingSpeed);
    }

    return () => clearTimeout(timeout);
  }, [text, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, pauseTime]);

  return text;
};

const Hero = () => {
  const typedRole = useTypewriter(RESUME.taglines);

  const metrics = [
    { value: "92%", label: "Workflow Efficiency" },
    { value: "88%", label: "Analytics Accuracy" },
    { value: "95%", label: "Automation Rate" }
  ];

  return (
    <section id="home" className="min-h-screen pt-28 pb-16 flex items-center relative z-10">
      <div className="max-w-6xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* Left — Text */}
        <div>
          <FadeIn delay={0.1}>
            <span className="inline-block py-1.5 px-4 border border-white/10 bg-white/[0.03] rounded-full text-[11px] font-mono uppercase tracking-[0.2em] text-slate-400 mb-6">
              Hello, I'm
            </span>
          </FadeIn>

          <FadeIn delay={0.2}>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-3 leading-[1.1]">
              <span className="gradient-text">Shreyas</span>{' '}
              <span className="text-white">Kulkarni</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="text-xl md:text-2xl text-slate-300 font-light mb-3 h-10 flex items-center">
              <span>{typedRole}</span>
              <span className="typewriter-cursor" />
            </div>
          </FadeIn>

          <FadeIn delay={0.35}>
            <p className="text-slate-400 font-light leading-relaxed max-w-lg mb-8 text-[15px]">
              Architecting scalable Agentic AI systems, orchestrating distributed LLM pipelines, and engineering the future of intelligent enterprise automation.
            </p>
          </FadeIn>

          {/* Floating metric badges */}
          <FadeIn delay={0.4} className="flex flex-wrap gap-3 mb-10">
            {metrics.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + i * 0.15 }}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm"
              >
                <span className="text-cyan-400 font-semibold text-sm font-mono">{m.value}</span>
                <span className="text-slate-500 text-[10px] uppercase tracking-widest font-mono">{m.label}</span>
              </motion.div>
            ))}
          </FadeIn>

          {/* CTA buttons */}
          <FadeIn delay={0.45} className="flex flex-wrap gap-4 items-center mb-12">
            <a href="#about" className="group px-8 py-4 bg-white text-black font-medium rounded-full hover:bg-slate-100 transition-all flex items-center gap-2 shadow-lg shadow-white/5">
              About Me <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="#contact" className="px-8 py-4 bg-transparent border border-white/15 text-white font-medium rounded-full hover:bg-white/5 hover:border-white/25 transition-all flex items-center gap-2">
              Contact <MessageSquare size={18} />
            </a>
          </FadeIn>

          {/* Social links */}
          <FadeIn delay={0.5}>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-600 flex items-center gap-4 mb-4">
              Connect
              <div className="h-[1px] w-12 bg-white/10" />
            </span>
            <div className="flex gap-3">
              {[
                { icon: <Linkedin size={18} />, href: RESUME.linkedin },
                { icon: <Github size={18} />, href: RESUME.github },
                { icon: <Mail size={18} />, href: `mailto:${RESUME.email}` }
              ].map((social, i) => (
                <motion.a
                  key={i} href={social.href} target="_blank" rel="noreferrer"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                  className="w-11 h-11 rounded-full border border-white/10 bg-white/[0.02] backdrop-blur flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(6,182,212,0.2)] transition-all duration-300"
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </FadeIn>
        </div>

        {/* Right — RAG Chatbot */}
        <div className="relative flex justify-center lg:justify-end mt-8 lg:mt-0 w-full">
          <RAGChatbot />
        </div>
      </div>
    </section>
  );
};

export default Hero;
