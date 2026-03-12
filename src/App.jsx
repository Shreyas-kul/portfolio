import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float, PerspectiveCamera, OrbitControls } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Network, Share2, Code2, BrainCircuit, TerminalSquare, User, Briefcase,
  GraduationCap, ChevronRight, Zap, Database, ShieldCheck, ArrowRight, Activity,
  Linkedin, Github, Mail, Download, MessageSquare, Send, CheckCircle2,
  Cloud, DatabaseZap
} from 'lucide-react';
import * as THREE from 'three';

const RESUME = {
  name: "Shreyas Kulkarni",
  role: "AI/ML Engineer",
  email: "shrkul@gmail.com",
  phone: "+91 9380489018",
  objective: "AI/ML Engineer with a strong foundation in Python, Transformers, and LLM fine-tuning, combined with experience in distributed cloud automation using Azure Logic Apps, Service Bus, and Power Automate. Adept at designing scalable AI architectures with RAG, LangChain, and Vector Databases. Passionate about building next-gen Agentic AI systems and enterprise automation pipelines. Achieved 95%+ AI automation efficiency across projects.",
  education: {
    degree: "Bachelor of Engineering in AI/ML",
    school: "B.M.S College of Engineering",
    duration: "Dec 2021 – June 2025"
  },
  experience: [
    {
      company: "sa.global Labs",
      role: "Software Development Engineer (Global Role)",
      duration: "Dec 2025 – Present",
      bullets: [
        "Working in a global R&D role building cutting-edge AI systems and next-generation agentic architectures.",
        "Designing and implementing Agent-to-Agent (A2A) communication systems and MCP-based LRM architectures.",
        "Architecting scalable, long-running intelligent systems focused on reasoning, memory, and orchestration.",
        "Developing AI backends using MongoDB and Neo4j for document, relational, and graph-based intelligence."
      ]
    },
    {
      company: "sa.global",
      role: "Azure AI Intern",
      duration: "Mar 2025 – Sept 2025",
      bullets: [
        "Built an Agentic AI system for employee feedback using Microsoft Copilot Studio, improving workflow automation by 92%.",
        "Integrated LLM orchestration with Azure Logic Apps and Bot Framework, enhancing process reliability by 80%.",
        "Developed AI dashboards (Streamlit, Power Automate) providing 70% faster insights into service logs.",
        "Designed a performance evaluation system leveraging RAG, boosting analytics accuracy by 88%."
      ]
    }
  ],
  projects: [
    {
      title: "Employee Feedback Assistant",
      duration: "May 2025 – Jul 2025",
      category: "Agentic AI",
      description: "Automated workflows using Copilot Studio and Power Automate. 95% reduction in manual HR workload. Integrated Azure DevOps, Dynamics 365, and GPT-4o."
    },
    {
      title: "Doc-U-Chat — LangChain RAG",
      duration: "May 2024 – Jun 2024",
      category: "Generative AI",
      description: "Scalable RAG chatbot using LangChain, Llama 3 70B, and FastAPI on AKS. 98% retrieval accuracy with Qdrant Vector DB."
    },
    {
      title: "Sales & Marketing Automation",
      duration: "Aug 2025 – Oct 2025",
      category: "Cloud Pipelines",
      description: "Predictive ML pipelines using Logic Apps, Power Automate, and Azure AI. Automated multi-stage ingestion yielding 90% accurate churn predictions."
    }
  ],
  skills: [
    { category: "Languages", items: ["Python", "C", "SQL", "C++", "Java"] },
    { category: "Cloud & DevOps", items: ["Azure Platform", "AWS", "Docker", "CI/CD", "AKS", "Logic Apps"] },
    { category: "Databases", items: ["Vector DBs (Qdrant)", "PostgreSQL", "MongoDB", "Neo4j"] },
    { category: "AI Architecture", items: ["Azure AI Studio", "OpenAI", "PyTorch", "Transformers", "LangChain", "AutoGen v2"] }
  ],
  certifications: [
    "Azure AI Engineer Associate",
    "Azure Fundamentals (AZ-900)",
    "Generative AI with LLMs — DeepLearning.AI",
    "IBM Data Science Professional"
  ]
};

// --- Ethereal Background ---
const ParticleField = () => {
  const points = useRef();

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y = state.clock.elapsedTime * 0.05;
      points.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  const particleCount = 2000;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

    const color = new THREE.Color(Math.random() > 0.5 ? '#ffffff' : '#00f2fe');
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particleCount} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={particleCount} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.02} vertexColors transparent opacity={0.4} sizeAttenuation />
    </points>
  );
};

const CinematicBackground = () => (
  <div className="fixed inset-0 z-0 pointer-events-none bg-[#020202]">
    <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-600/10 blur-[120px]" />
    <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-cyan-600/10 blur-[120px]" />
    <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
      <ParticleField />
    </Canvas>
    <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
  </div>
);

// --- Fade In Wrapper ---
const FadeIn = ({ children, delay = 0, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

// --- COMPONENTS ---

const RAGChatbot = () => {
  const [messages, setMessages] = useState([
    { role: 'system', text: 'Shreyas.Agent initialized. RAG context loaded on FastAPI Backend. ChromaDB connected. Ask me anything about Shreyas.' }
  ]);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('ready');
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || status === 'querying') return;

    const query = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: query }]);
    setMessages(prev => [...prev, { role: 'system', text: 'Querying Vector DB...', id: 'loading' }]);
    setStatus('querying');

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
      const response = await fetch(`${backendUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });

      if (!response.ok) {
        throw new Error('Backend is not running or rejected the request');
      }

      const data = await response.json();
      const isFallback = data.source === 'External API';

      setMessages(prev => [...prev.filter(m => m.id !== 'loading'), {
        role: 'system',
        text: data.answer,
        meta: isFallback ? `Generated via Groq Llama 3 (General Knowledge)` : `Retrieved via ChromaDB | Synthesized with Llama 3`
      }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev.filter(m => m.id !== 'loading'), { role: 'system', text: 'Connection Error. Is the FastAPI backend running?' }]);
    } finally {
      setStatus('ready');
    }
  };

  return (
    <FadeIn delay={0.6} className="relative w-full max-w-md h-[440px] flex flex-col bg-[#050505]/80 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.15)] mx-auto md:ml-auto md:mr-0 z-20">
      <div className="px-6 py-4 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <BrainCircuit size={16} className="text-cyan-400" />
          </div>
          <div>
            <h3 className="text-white font-medium text-sm">Shreyas.Agent</h3>
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${status === 'ready' ? 'bg-emerald-500' : 'bg-cyan-500 animate-pulse'}`} />
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">{status}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-grow p-6 overflow-y-auto flex flex-col gap-4" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
        {messages.map((msg, i) => (
          <div key={i} className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'self-end items-end' : 'self-start items-start'}`}>
            <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
              ? 'bg-white text-black rounded-tr-sm'
              : 'bg-[#111] border border-white/5 text-slate-300 rounded-tl-sm'
              }`}>
              {msg.text}
            </div>
            {msg.meta && (
              <span className="text-[9px] font-mono text-cyan-500/50 uppercase tracking-widest mt-2 px-1">
                {msg.meta}
              </span>
            )}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <form onSubmit={sendMessage} className="p-4 bg-[rgba(0,0,0,0.5)] border-t border-white/5 relative">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask about my experience..."
          className="w-full bg-[#1A1A1A] border border-white/10 rounded-full pl-6 pr-14 py-3 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors placeholder:text-slate-600"
        />
        <button type="submit" disabled={!input.trim()} className="absolute right-6 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-cyan-500 text-black flex items-center justify-center disabled:opacity-50 disabled:bg-white/10 disabled:text-white/30 transition-all">
          <ArrowRight size={14} />
        </button>
      </form>
    </FadeIn>
  );
};

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
        <a href="#home" className="text-xl font-bold tracking-tighter text-white">Portfolio<span className="text-cyan-400">.</span></a>
        <ul className="hidden md:flex gap-8 text-xs font-mono uppercase tracking-widest text-slate-400">
          <li><a href="#home" className="hover:text-white transition-colors">Home</a></li>
          <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
          <li><a href="#skills" className="hover:text-white transition-colors">Skills</a></li>
          <li><a href="#projects" className="hover:text-white transition-colors">Projects</a></li>
          <li><a href="#ai-hub" className="text-cyan-400 hover:text-cyan-300 transition-colors">AI Hub</a></li>
          <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
        </ul>
      </div>
    </nav>
  );
};

const Hero = () => (
  <section id="home" className="min-h-screen pt-24 pb-12 flex items-center relative z-10">
    <div className="max-w-6xl mx-auto px-6 w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

      {/* Intro Text */}
      <div>
        <FadeIn delay={0.1}>
          <span className="inline-block py-1 px-3 border border-white/10 bg-white/5 rounded-full text-xs font-mono uppercase tracking-widest text-slate-400 mb-6">
            Hello, I'm
          </span>
        </FadeIn>

        <FadeIn delay={0.2}>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-medium tracking-tight text-white mb-4 leading-tight">
            Shreyas Kulkarni
            <span className="inline-flex text-cyan-400 ml-1">
              <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>.</motion.span>
              <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}>.</motion.span>
            </span>
          </h1>
        </FadeIn>

        <FadeIn delay={0.3}>
          <h2 className="text-xl md:text-2xl text-slate-300 font-light mb-8 opacity-90">
            {RESUME.role}
          </h2>
          <p className="text-slate-400 font-light leading-relaxed max-w-lg mb-10">
            Architecting scalable Agentic AI systems, orchestrating distributed cloud pipelines, and engineering the future of intelligent automation.
          </p>
        </FadeIn>

        <FadeIn delay={0.4} className="flex flex-wrap gap-4 items-center">
          <a href="#about" className="px-8 py-4 bg-white text-black font-medium rounded-full hover:bg-slate-200 transition-all flex items-center gap-2">
            About Me <ArrowRight size={18} />
          </a>
          <a href="#contact" className="px-8 py-4 bg-transparent border border-white/20 text-white font-medium rounded-full hover:bg-white/5 transition-all flex items-center gap-2">
            Contact <MessageSquare size={18} />
          </a>
        </FadeIn>

        <FadeIn delay={0.5} className="mt-12 flex flex-col gap-4">
          <span className="text-xs font-mono uppercase tracking-widest text-slate-500 flex items-center gap-4">
            Connect
            <div className="h-[1px] w-12 bg-white/10" />
          </span>
          <div className="flex gap-4">
            {[
              { icon: <Linkedin size={20} />, href: "https://linkedin.com/in/shrkul" },
              { icon: <Github size={20} />, href: "https://github.com/" },
              { icon: <Mail size={20} />, href: `mailto:${RESUME.email}` }
            ].map((social, i) => (
              <motion.a
                key={i} href={social.href} target="_blank" rel="noreferrer"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 + (i * 0.1) }}
                className="w-12 h-12 rounded-full border border-white/10 bg-[#0a0a0a]/80 backdrop-blur flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all relative"
              >
                {social.icon}
              </motion.a>
            ))}
          </div>
        </FadeIn>
      </div>

      {/* Interactive RAG Chatbot */}
      <div className="relative flex justify-center md:justify-end mt-16 md:mt-0 w-full perspective-1000">
        <RAGChatbot />
      </div>
    </div>
  </section>
);

const About = () => (
  <section id="about" className="py-24 relative z-10 bg-black/40 border-y border-white/5">
    <div className="max-w-6xl mx-auto px-6">
      <FadeIn>
        <div className="text-center mb-16">
          <h2 className="text-sm font-mono uppercase tracking-widest text-cyan-400 mb-2">My Intro</h2>
          <h3 className="text-4xl md:text-5xl font-medium text-white tracking-tight">About Me</h3>
        </div>
      </FadeIn>

      <div className="grid md:grid-cols-12 gap-12 items-center">

        {/* Info Boxes */}
        <div className="md:col-span-5 grid grid-cols-2 gap-4">
          {[
            { title: "Experience", subtitle: "2+ Years", icon: <Briefcase /> },
            { title: "Completed", subtitle: "10+ Projects", icon: <CheckCircle2 /> },
            { title: "Accuracy", subtitle: "95% Automation", icon: <Activity /> },
            { title: "Certifications", subtitle: "4 Global Certs", icon: <ShieldCheck /> }
          ].map((box, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/5 p-6 rounded-2xl flex flex-col items-center justify-center text-center hover:border-white/20 transition-all h-full">
                <div className="text-cyan-400 mb-4">{box.icon}</div>
                <h4 className="text-white font-medium mb-1">{box.title}</h4>
                <p className="text-slate-500 text-xs font-mono uppercase tracking-widest">{box.subtitle}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Text Area */}
        <div className="md:col-span-7">
          <FadeIn delay={0.2}>
            <p className="text-slate-300 text-lg leading-relaxed font-light mb-8">
              {RESUME.objective}
            </p>

            <div className="flex items-start gap-4 mb-8">
              <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center bg-white/5 flex-shrink-0">
                <GraduationCap className="text-white/70" size={20} />
              </div>
              <div>
                <h4 className="text-white font-medium text-lg">{RESUME.education.degree}</h4>
                <p className="text-slate-400 font-light">{RESUME.education.school}</p>
                <p className="text-slate-500 text-xs font-mono uppercase tracking-widest mt-1">{RESUME.education.duration}</p>
              </div>
            </div>

            <a href="#" className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors text-white font-medium text-sm">
              <Download size={16} /> Download Resume
            </a>
          </FadeIn>
        </div>
      </div>
    </div>
  </section>
);

const Skills = () => (
  <section id="skills" className="py-24 relative z-10">
    <div className="max-w-6xl mx-auto px-6">
      <FadeIn>
        <div className="text-center mb-16">
          <h2 className="text-sm font-mono uppercase tracking-widest text-cyan-400 mb-2">My Abilities</h2>
          <h3 className="text-4xl md:text-5xl font-medium text-white tracking-tight">Technology Stack</h3>
        </div>
      </FadeIn>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {RESUME.skills.map((group, idx) => (
          <FadeIn key={idx} delay={idx * 0.1} className="bg-[#0a0a0a]/60 backdrop-blur-3xl border border-white/5 rounded-3xl p-8 hover:border-white/10 transition-colors">
            <h4 className="text-white font-medium text-lg mb-6 flex items-center gap-3 pb-4 border-b border-white/5">
              {idx === 0 && <Code2 className="text-cyan-400" size={20} />}
              {idx === 1 && <Cloud className="text-blue-400" size={20} />}
              {idx === 2 && <DatabaseZap className="text-purple-400" size={20} />}
              {idx === 3 && <BrainCircuit className="text-emerald-400" size={20} />}
              {group.category}
            </h4>
            <div className="flex flex-col gap-3">
              {group.items.map((item, i) => (
                <div key={i} className="flex items-center gap-3 group">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-cyan-400 transition-colors" />
                  <span className="text-slate-400 font-light text-sm group-hover:text-white transition-colors">{item}</span>
                </div>
              ))}
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
);

const Works = () => {
  const [filter, setFilter] = useState('All');
  const categories = ['All', 'Generative AI', 'Agentic AI', 'Cloud Pipelines'];

  const filteredProjects = filter === 'All'
    ? RESUME.projects
    : RESUME.projects.filter(p => p.category === filter);

  return (
    <section id="projects" className="py-24 relative z-10 bg-black/40 border-y border-white/5">
      <div className="max-w-6xl mx-auto px-6">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-sm font-mono uppercase tracking-widest text-cyan-400 mb-2">My Portfolio</h2>
            <h3 className="text-4xl md:text-5xl font-medium text-white tracking-tight">Recent Deployments</h3>
          </div>
        </FadeIn>

        <FadeIn delay={0.1} className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${filter === cat ? 'bg-white text-black' : 'bg-[#111] border border-white/10 text-slate-400 hover:text-white hover:border-white/30'
                }`}
            >
              {cat}
            </button>
          ))}
        </FadeIn>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((proj, idx) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={proj.title}
                className="group relative bg-[#0a0a0a]/60 backdrop-blur-xl border border-white/5 rounded-3xl p-8 overflow-hidden hover:border-cyan-500/30 transition-all flex flex-col justify-between min-h-[250px]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative z-10">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 mb-4 bg-cyan-500/10 px-3 py-1 rounded inline-block">
                    {proj.category}
                  </div>
                  <h4 className="text-xl font-medium text-white mb-3">{proj.title}</h4>
                  <p className="text-slate-400 text-sm font-light leading-relaxed">{proj.description}</p>
                </div>

                <div className="relative z-10 mt-6 flex justify-between items-end border-t border-white/5 pt-4">
                  <span className="text-xs font-mono text-slate-500">{proj.duration}</span>
                  <a href="#" className="flex items-center gap-2 text-white text-sm hover:text-cyan-400 transition-colors">
                    Review <ArrowRight size={14} />
                  </a>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

const AISandbox = () => {
  const [activeTab, setActiveTab] = useState('ml');
  const [status, setStatus] = useState('offline');
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const workerRef = useRef(null);

  useEffect(() => {
    workerRef.current = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' });
    workerRef.current.addEventListener('message', (e) => {
      if (e.data.status === 'ready' || e.data.status === 'complete') {
        setStatus('ready');
        if (e.data.output) setResult(e.data.output[0]);
      } else if (e.data.status === 'progress') {
        setStatus('loading');
      }
    });
    return () => workerRef.current?.terminate();
  }, []);

  const analyzeText = () => {
    if (!text.trim()) return;
    setStatus('analyzing');
    workerRef.current.postMessage({ text });
  };

  const tabs = [
    { id: 'ml', label: "Browser Inference Sandbox", icon: <BrainCircuit size={16} /> },
    { id: 'agentic', label: "Agentic Architecture", icon: <Network size={16} /> },
    { id: 'rag', label: "RAG & Vector DBs", icon: <Database size={16} /> },
    { id: 'transformer', label: "Self-Attention", icon: <Code2 size={16} /> }
  ];

  return (
    <section id="ai-hub" className="py-24 relative z-10">
      <div className="max-w-6xl mx-auto px-6">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-sm font-mono uppercase tracking-widest text-cyan-400 mb-2">Interactive</h2>
            <h3 className="text-4xl md:text-5xl font-medium text-white tracking-tight">AI Architecture Hub</h3>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="flex flex-col lg:flex-row gap-8 bg-[#0a0a0a]/60 backdrop-blur-3xl border border-white/5 rounded-[2rem] p-6 md:p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-cyan-600/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="w-full lg:w-64 flex-shrink-0 flex flex-col gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 pl-6 border-l-2 text-left font-light tracking-wide transition-all duration-300 flex items-center gap-3 ${activeTab === tab.id
                    ? 'border-cyan-400 text-white bg-white/[0.03]'
                    : 'border-white/5 text-slate-500 hover:text-slate-300 hover:border-white/20 hover:bg-white/[0.01]'
                    }`}
                >
                  <span className={activeTab === tab.id ? 'text-cyan-400' : 'text-slate-600'}>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex-grow relative min-h-[400px]">
              <AnimatePresence mode="wait">
                {activeTab === 'ml' && (
                  <motion.div key="ml" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="h-full flex flex-col justify-center">
                    <h4 className="text-2xl font-medium text-white mb-4 tracking-tight">In-Browser Edge Computing</h4>
                    <p className="text-slate-400 font-light text-sm mb-8 max-w-xl">
                      A DistilBERT transformer loaded into local browser memory via WebAssembly. Zero backend CPU usage. Type a sentence below to run inference.
                    </p>
                    <textarea
                      value={text} onChange={(e) => setText(e.target.value)}
                      placeholder="Input unstructured string for sentiment analysis... (e.g. 'This portfolio architecture is phenomenal!')"
                      className="w-full bg-[#111] border border-white/10 rounded-2xl p-6 text-white focus:outline-none focus:border-cyan-500/50 transition-colors font-mono text-sm resize-none h-32 mb-6"
                    />
                    <div className="flex flex-wrap gap-4 items-center">
                      <button onClick={analyzeText} disabled={status === 'loading' || status === 'analyzing'} className="px-8 py-3 bg-white text-black font-medium rounded-xl hover:bg-slate-200 disabled:opacity-50 transition-colors shadow-lg shadow-white/5">
                        Compute Inference
                      </button>
                      <div className="flex items-center gap-3 px-4 py-3 bg-[#111] border border-white/5 rounded-xl text-xs font-mono uppercase tracking-widest text-slate-500">
                        <div className={`w-2 h-2 rounded-full ${status === 'ready' ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : status === 'analyzing' || status === 'loading' ? 'bg-cyan-500 animate-pulse' : 'bg-slate-700'}`} />
                        Module: {status}
                      </div>
                    </div>
                    {result && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 bg-[#111] border border-white/5 p-6 rounded-2xl">
                        <div className="flex justify-between items-end mb-4 font-mono">
                          <div><div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Classification</div><div className={`text-xl tracking-widest font-medium ${result.label === 'POSITIVE' ? 'text-emerald-400' : 'text-red-400'}`}>{result.label}</div></div>
                          <div className="text-right"><div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Probability</div><div className="text-white">{(result.score * 100).toFixed(2)}%</div></div>
                        </div>
                        <div className="w-full bg-[#222] rounded-full h-1 overflow-hidden">
                          <div className={`h-full transition-all duration-1000 ${result.label === 'POSITIVE' ? 'bg-emerald-400' : 'bg-red-400'}`} style={{ width: `${Math.round(result.score * 100)}%` }} />
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* Agentic  */}
                {activeTab === 'agentic' && (
                  <motion.div key="agentic" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="h-full flex flex-col justify-center">
                    <h3 className="text-2xl font-medium text-white mb-6 tracking-tight">Agent-to-Agent (A2A) Systems</h3>
                    <p className="text-slate-400 font-light text-base leading-relaxed mb-8 max-w-2xl">
                      Beyond prompting LLMs, modern intelligence requires autonomy. Agentic systems orchestrate logic flows, utilize APIs dynamically, and collaborate via sub-agents to synthesize complex workflows.
                    </p>
                    <div className="bg-[#111] rounded-2xl p-6 border border-white/5 font-mono text-[11px] md:text-xs text-slate-400">
                      <div className="flex items-center gap-4 mb-4 pb-4 border-b border-white/5"><div className="w-2 h-2 rounded-full bg-emerald-500" /><span className="uppercase text-emerald-400">Azure Copilot Automation</span></div>
                      <div className="space-y-3">
                        <p><span className="text-slate-600">01</span> Orchestrator {"->"} Formulates multi-step logic.</p>
                        <p className="text-white pl-4">{"↳"} Sub-Agent A: Query Vector DB for context.</p>
                        <p className="text-white pl-4">{"↳"} Sub-Agent B: Trigger Logic App Payload.</p>
                        <p><span className="text-slate-600">02</span> Synergy yields 95% Automated HR Resolution.</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* RAG */}
                {activeTab === 'rag' && (
                  <motion.div key="rag" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="h-full flex flex-col justify-center">
                    <h3 className="text-2xl font-medium text-white mb-6 tracking-tight">Retrieval-Augmented Generation</h3>
                    <p className="text-slate-400 font-light text-base leading-relaxed mb-8">
                      Grounding LLMs in verifiable reality. RAG architecture converts queries to mathematical embeddings, retrieves semantically identical corporate data from Vector DBs (like Qdrant), and injects truth to stop hallucinations.
                    </p>
                    <div className="grid md:grid-cols-3 gap-4">
                      {[{ title: "Ingestion", desc: "Data chunked into dense semantic vectors." }, { title: "Storage", desc: "Qdrant/Neo4j index vectors for similarity search." }, { title: "Injection", desc: "Top-k chunks appended to formulate response." }].map((b, i) => (
                        <div key={i} className="bg-[#111] p-5 rounded-2xl border border-white/5">
                          <h4 className="text-white font-medium text-sm mb-2">{b.title}</h4>
                          <p className="text-slate-400 text-xs font-light">{b.desc}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Transformer */}
                {activeTab === 'transformer' && (
                  <motion.div key="transformer" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="h-full flex flex-col justify-center">
                    <h3 className="text-2xl font-medium text-white mb-6 tracking-tight">Transformers & Self-Attention</h3>
                    <p className="text-slate-400 font-light text-base leading-relaxed mb-8">
                      The foundational architecture of the modern AI era. By replacing sequential processing with global Self-Attention mechanisms, Transformers parse entire matrices of data simultaneously.
                    </p>
                    <div className="bg-[#111] p-8 rounded-2xl border border-white/5 text-center">
                      <p className="font-mono text-sm text-slate-400 leading-loose">
                        The <span className="bg-white/10 text-white px-2 py-1 rounded">animal</span> didn't cross the street because <span className="border border-cyan-500/50 text-cyan-400 px-2 py-1 rounded shadow-[0_0_10px_rgba(6,182,212,0.2)]">it</span> was too tired.
                      </p>
                      <p className="text-light text-xs text-slate-500 mt-6 mx-auto">Model dynamically maps "it" to "animal", ignoring "street".</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

const Contact = () => (
  <section id="contact" className="py-24 relative z-10 bg-black/40 border-t border-white/5">
    <div className="max-w-4xl mx-auto px-6">
      <FadeIn>
        <div className="text-center mb-16">
          <h2 className="text-sm font-mono uppercase tracking-widest text-cyan-400 mb-2">Get In Touch</h2>
          <h3 className="text-4xl md:text-5xl font-medium text-white tracking-tight">Contact Me</h3>
        </div>
      </FadeIn>

      <div className="grid md:grid-cols-2 gap-12">
        <FadeIn delay={0.1}>
          <h4 className="text-2xl font-medium text-white mb-6">Talk to me</h4>
          <div className="space-y-4">
            <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/5 p-6 rounded-2xl text-center group">
              <Mail className="mx-auto text-cyan-400 mb-4" />
              <h5 className="text-white font-medium mb-1">Email</h5>
              <p className="text-slate-400 text-sm mb-4">{RESUME.email}</p>
              <a href={`mailto:${RESUME.email}`} className="text-xs font-mono uppercase tracking-widest text-slate-500 group-hover:text-white transition-colors flex items-center justify-center gap-2">Write Me <ArrowRight size={12} /></a>
            </div>
            <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/5 p-6 rounded-2xl text-center group">
              <Linkedin className="mx-auto text-blue-400 mb-4" />
              <h5 className="text-white font-medium mb-1">LinkedIn</h5>
              <p className="text-slate-400 text-sm mb-4">Shreyas Kulkarni</p>
              <a href="https://linkedin.com/" target="_blank" className="text-xs font-mono uppercase tracking-widest text-slate-500 group-hover:text-white transition-colors flex items-center justify-center gap-2">Connect <ArrowRight size={12} /></a>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <h4 className="text-2xl font-medium text-white mb-6">Write your message</h4>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <input type="text" placeholder="Name" className="w-full bg-[#111] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-cyan-500/50 transition-colors text-sm" />
            <input type="email" placeholder="Email" className="w-full bg-[#111] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-cyan-500/50 transition-colors text-sm" />
            <textarea placeholder="Message" className="w-full bg-[#111] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-cyan-500/50 transition-colors text-sm resize-none h-32" />
            <button className="w-full py-4 bg-white text-black font-medium rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2">
              Send Message <Send size={16} />
            </button>
          </form>
        </FadeIn>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="relative z-10 py-8 bg-[#020202] border-t border-white/5 text-center">
    <div className="max-w-6xl mx-auto px-6 flex flex-col items-center">
      <span className="text-xl font-bold tracking-tighter text-white mb-6">Portfolio<span className="text-cyan-400">.</span></span>
      <ul className="flex flex-wrap justify-center gap-6 text-xs font-mono uppercase tracking-widest text-slate-400 mb-8">
        <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
        <li><a href="#projects" className="hover:text-white transition-colors">Projects</a></li>
        <li><a href="#ai-hub" className="hover:text-white transition-colors">AI Hub</a></li>
      </ul>
      <p className="text-slate-600 text-[10px] font-mono uppercase tracking-widest">© 2026 Shreyas Kulkarni. All rights reserved.</p>
    </div>
  </footer>
);

export default function App() {
  return (
    <div className="relative text-slate-50 font-sans selection:bg-white/20 bg-[#020202]">
      <CinematicBackground />
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Works />
      <AISandbox />
      <Contact />
      <Footer />
    </div>
  );
}
