import React from 'react';
import { Mail, Linkedin, ArrowRight, Send } from 'lucide-react';
import { RESUME } from '../data';
import { FadeIn, SectionHeader } from './FadeIn';

const Contact = () => (
  <section id="contact" className="py-28 relative z-10">
    <div className="section-divider" />
    <div className="max-w-4xl mx-auto px-6 pt-28">
      <SectionHeader label="Get In Touch" title="Contact Me" />

      <div className="grid md:grid-cols-2 gap-12">
        {/* Left — cards */}
        <FadeIn delay={0.1}>
          <h4 className="text-2xl font-semibold text-white mb-6">Talk to me</h4>
          <div className="space-y-4">
            <div className="glass rounded-2xl p-6 text-center group card-hover">
              <Mail className="mx-auto text-cyan-400 mb-4" />
              <h5 className="text-white font-medium mb-1">Email</h5>
              <p className="text-slate-400 text-sm mb-4">{RESUME.email}</p>
              <a href={`mailto:${RESUME.email}`} className="text-[11px] font-mono uppercase tracking-[0.15em] text-slate-500 group-hover:text-cyan-400 transition-colors flex items-center justify-center gap-2">
                Write Me <ArrowRight size={12} />
              </a>
            </div>
            <div className="glass rounded-2xl p-6 text-center group card-hover">
              <Linkedin className="mx-auto text-blue-400 mb-4" />
              <h5 className="text-white font-medium mb-1">LinkedIn</h5>
              <p className="text-slate-400 text-sm mb-4">Shreyas Kulkarni</p>
              <a href={RESUME.linkedin} target="_blank" className="text-[11px] font-mono uppercase tracking-[0.15em] text-slate-500 group-hover:text-blue-400 transition-colors flex items-center justify-center gap-2">
                Connect <ArrowRight size={12} />
              </a>
            </div>
          </div>
        </FadeIn>

        {/* Right — form */}
        <FadeIn delay={0.2}>
          <h4 className="text-2xl font-semibold text-white mb-6">Write your message</h4>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="relative group">
              <input type="text" placeholder="Name" className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 text-white focus:outline-none focus:border-cyan-500/40 transition-all text-sm placeholder:text-slate-600" />
            </div>
            <div className="relative group">
              <input type="email" placeholder="Email" className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 text-white focus:outline-none focus:border-cyan-500/40 transition-all text-sm placeholder:text-slate-600" />
            </div>
            <div className="relative group">
              <textarea placeholder="Message" className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 text-white focus:outline-none focus:border-cyan-500/40 transition-all text-sm resize-none h-32 placeholder:text-slate-600" />
            </div>
            <button className="w-full py-4 bg-white text-black font-medium rounded-xl hover:bg-slate-100 transition-all flex items-center justify-center gap-2 shadow-lg shadow-white/5 group">
              Send Message <Send size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </FadeIn>
      </div>
    </div>
  </section>
);

export default Contact;
