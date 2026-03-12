import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float, PerspectiveCamera, OrbitControls } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Network, Share2, Code2, BrainCircuit, TerminalSquare, User, Briefcase,
  GraduationCap, ChevronRight, Zap, Target, Server, Database, Cloud, DatabaseZap, Workflow, ShieldCheck, ArrowRight, Activity
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
      description: "Automated workflows using Copilot Studio and Power Automate. 95% reduction in manual HR workload. Integrated Azure DevOps, Dynamics 365, and GPT-4o."
    },
    {
      title: "Doc-U-Chat — LangChain RAG",
      duration: "May 2024 – Jun 2024",
      description: "Scalable RAG chatbot using LangChain, Llama 3 70B, and FastAPI on AKS. 98% retrieval accuracy with Qdrant Vector DB."
    },
    {
      title: "Sales & Marketing Automation",
      duration: "Aug 2025 – Oct 2025",
      description: "Predictive ML pipelines using Logic Apps, Power Automate, and Azure AI. Automated multi-stage ingestion yielding 90% accurate churn predictions."
    }
  ],
  skills: [
    { category: "Languages", items: ["Python", "C", "SQL", "C++", "Java"] },
    { category: "Cloud & DevOps", items: ["Azure Platform", "AWS", "Docker", "CI/CD", "AKS"] },
    { category: "Databases", items: ["Vector DBs", "PostgreSQL", "MongoDB", "Neo4j"] },
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

    // Subtle silver/cyan mix
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
    {/* Noise Texture */}
    <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
  </div>
);

// --- 1. CINEMATIC HERO SECTION ---
const ElegantHero = ({ onSelect }) => (
  <motion.div
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, filter: 'blur(10px)' }} transition={{ duration: 0.8 }}
    className="min-h-screen flex flex-col items-center justify-center relative z-10 px-6 max-w-6xl mx-auto w-full"
  >
    <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-20">
      <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}>
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-medium tracking-tight text-white mb-6 leading-tight" style={{ fontFamily: 'Inter, sans-serif', fontFeatureSettings: '"ss01", "cv01"' }}>
          Hi, I am {RESUME.name}
          <span className="inline-flex">
            <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>.</motion.span>
            <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}>.</motion.span>
          </span>
        </h1>
      </motion.div>
      <motion.p
        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="text-xl md:text-2xl text-slate-400 font-light tracking-tight max-w-2xl"
      >
        Architecting scalable <span className="text-white">Agentic AI systems</span>, orchestrating distributed cloud pipelines, and engineering the future of intelligent automation.
      </motion.p>
    </div>

    <motion.div
      initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6, duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full"
    >
      {/* Option: Context (Resume) */}
      <button
        onClick={() => onSelect('about')}
        className="group relative h-[30vh] min-h-[250px] bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/5 rounded-3xl p-8 overflow-hidden transition-all duration-500 hover:bg-[#111] hover:border-white/20 text-left flex flex-col justify-between"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative z-10 flex justify-between items-start">
          <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center bg-white/5 group-hover:scale-110 transition-transform duration-500">
            <User className="text-white/70" size={20} />
          </div>
          <ArrowRight className="text-white/30 group-hover:text-white transition-colors duration-500 transform group-hover:translate-x-1" size={24} />
        </div>
        <div className="relative z-10">
          <h3 className="text-3xl font-medium text-white tracking-tight mb-2">My Context</h3>
          <p className="text-slate-500 text-sm font-light">Examine engineering background, technical stack, and production deployments.</p>
        </div>
      </button>

      {/* Option: Interactive Sandbox */}
      <button
        onClick={() => onSelect('play')}
        className="group relative h-[30vh] min-h-[250px] bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/5 rounded-3xl p-8 overflow-hidden transition-all duration-500 hover:bg-[#111] hover:border-cyan-500/30 text-left flex flex-col justify-between"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-cyan-500/20 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

        <div className="relative z-10 flex justify-between items-start">
          <div className="w-12 h-12 rounded-full border border-cyan-500/20 flex items-center justify-center bg-cyan-500/10 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_15px_rgba(6,182,212,0)] group-hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]">
            <BrainCircuit className="text-cyan-400" size={20} />
          </div>
          <ArrowRight className="text-cyan-500/50 group-hover:text-cyan-400 transition-colors duration-500 transform group-hover:translate-x-1" size={24} />
        </div>
        <div className="relative z-10">
          <h3 className="text-3xl font-medium text-white tracking-tight mb-2">Interactive AI Hub</h3>
          <p className="text-slate-500 text-sm font-light">Engage with live neural networks in the browser. Learn architecture concepts.</p>
        </div>
      </button>
    </motion.div>
  </motion.div>
);

// --- 2. GLASSMORPHISM ABOUT SECTION ---
const RefinedProfile = ({ onBack, onPlayClick }) => (
  <motion.div
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, filter: 'blur(10px)' }} transition={{ duration: 0.6 }}
    className="min-h-screen py-24 px-4 sm:px-6 relative z-10 max-w-7xl mx-auto w-full"
  >
    <button onClick={onBack} className="group mb-12 flex items-center gap-3 text-slate-500 hover:text-white transition-colors uppercase font-mono text-[11px] tracking-[0.2em]">
      <div className="w-8 h-[1px] bg-slate-500 group-hover:bg-white group-hover:w-12 transition-all duration-500" />
      Back to Root
    </button>

    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">

      {/* Header Profile - Span 8 */}
      <div className="lg:col-span-8 bg-[#0a0a0a]/60 backdrop-blur-3xl border border-white/5 rounded-[2rem] p-8 md:p-12 hover:border-white/10 transition-colors">
        <h1 className="text-4xl md:text-6xl font-medium text-white tracking-tight mb-4">{RESUME.name}</h1>
        <div className="flex flex-wrap items-center gap-4 text-sm font-mono uppercase tracking-widest text-slate-500 mb-8">
          <span className="text-white">{RESUME.role}</span>
          <span className="hidden sm:inline">•</span>
          <a href={`mailto:${RESUME.email}`} className="hover:text-blue-400 transition-colors">{RESUME.email}</a>
          <span className="hidden sm:inline">•</span>
          <span>{RESUME.phone}</span>
        </div>
        <p className="text-slate-400 text-lg leading-relaxed font-light max-w-3xl">
          {RESUME.objective}
        </p>
      </div>

      {/* Education - Span 4 */}
      <div className="lg:col-span-4 bg-[#0a0a0a]/60 backdrop-blur-3xl border border-white/5 rounded-[2rem] p-8 md:p-12 hover:border-white/10 transition-colors flex flex-col justify-between">
        <div>
          <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-white/5 mb-8">
            <GraduationCap className="text-white/70" size={18} />
          </div>
          <h2 className="text-2xl font-medium text-white tracking-tight mb-2">{RESUME.education.degree}</h2>
          <p className="text-slate-400 font-light">{RESUME.education.school}</p>
        </div>
        <div className="mt-8 font-mono text-[11px] uppercase tracking-widest text-slate-500 inline-block px-4 py-2 border border-white/5 rounded-full w-fit">
          {RESUME.education.duration}
        </div>
      </div>

      {/* Experience - Span 7 */}
      <div className="lg:col-span-7 bg-[#0a0a0a]/60 backdrop-blur-3xl border border-white/5 rounded-[2rem] p-8 md:p-12 hover:border-white/10 transition-colors">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-white/5">
            <Briefcase className="text-white/70" size={18} />
          </div>
          <h2 className="text-2xl font-medium text-white tracking-tight">Experience</h2>
        </div>

        <div className="space-y-12">
          {RESUME.experience.map((exp, idx) => (
            <div key={idx} className="relative">
              <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-4 gap-2">
                <div>
                  <h3 className="text-xl font-medium text-white tracking-tight">{exp.role}</h3>
                  <h4 className="text-blue-400 text-sm mt-1">{exp.company}</h4>
                </div>
                <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">{exp.duration}</span>
              </div>
              <ul className="space-y-3">
                {exp.bullets.map((b, i) => (
                  <li key={i} className="text-slate-400 font-light text-sm flex gap-4 leading-relaxed">
                    <span className="w-1 h-1 rounded-full bg-slate-700 block mt-2 flex-shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Projects - Span 5 */}
      <div className="lg:col-span-5 bg-[#0a0a0a]/60 backdrop-blur-3xl border border-white/5 rounded-[2rem] p-8 md:p-12 hover:border-white/10 transition-colors">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-white/5">
            <Code2 className="text-white/70" size={18} />
          </div>
          <h2 className="text-2xl font-medium text-white tracking-tight">Key Deployments</h2>
        </div>

        <div className="space-y-8">
          {RESUME.projects.map((proj, idx) => (
            <div key={idx} className="group p-5 rounded-2xl bg-white/[0.02] border border-white/0 hover:border-white/5 transition-all">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-white font-medium">{proj.title}</h3>
              </div>
              <p className="text-slate-400 text-sm font-light leading-relaxed mb-4">{proj.description}</p>
              <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{proj.duration}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Matrix wall - Span 12 */}
      <div className="lg:col-span-12 bg-[#0a0a0a]/60 backdrop-blur-3xl border border-white/5 rounded-[2rem] p-8 md:p-12 hover:border-white/10 transition-colors">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {RESUME.skills.map((group, idx) => (
            <div key={idx}>
              <h3 className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-6 pb-4 border-b border-white/5">{group.category}</h3>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item, i) => (
                  <span key={i} className="px-3 py-1.5 bg-[#111] border border-white/10 text-slate-300 text-xs rounded-lg hover:bg-white hover:text-black hover:border-white transition-all duration-300 cursor-default">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}

          <div className="lg:col-span-4 mt-4 pt-10 border-t border-white/5">
            <h3 className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-6">Certifications</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {RESUME.certifications.map((cert, idx) => (
                <li key={idx} className="text-slate-400 text-sm font-light flex items-center gap-3">
                  <ShieldCheck size={14} className="text-slate-600" /> {cert}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* CTA Bridge */}
      <div className="lg:col-span-12 group relative overflow-hidden bg-[#111] border border-white/10 rounded-[2rem] p-8 md:p-16 hover:border-cyan-500/30 transition-all duration-700 cursor-pointer" onClick={onPlayClick}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent flex translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-3xl md:text-5xl font-medium text-white tracking-tight mb-4">Explore Intelligence.</h2>
            <p className="text-slate-400 text-lg font-light max-w-xl">
              Transition to the Interactive AI Hub to execute native neural networks and review architecture protocols.
            </p>
          </div>
          <div className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-500">
            <ArrowRight size={24} />
          </div>
        </div>
      </div>

    </div>
  </motion.div>
);

// --- 3. REFINED AI SANDBOX ---
const MinimalSandbox = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('agentic');
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
    { id: 'agentic', label: "Agentic Architecture" },
    { id: 'rag', label: "RAG & Vector Embeddings" },
    { id: 'transformer', label: "Self-Attention Mechanism" },
    { id: 'ml', label: "Browser Inference Sandbox" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, filter: 'blur(10px)' }} transition={{ duration: 0.6 }}
      className="min-h-screen py-24 px-4 sm:px-6 relative z-10 max-w-7xl mx-auto flex flex-col"
    >
      <button onClick={onBack} className="group mb-12 flex items-center gap-3 text-slate-500 hover:text-white transition-colors uppercase font-mono text-[11px] tracking-[0.2em] w-fit">
        <div className="w-8 h-[1px] bg-slate-500 group-hover:bg-white group-hover:w-12 transition-all duration-500" />
        Terminate Interaction
      </button>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 flex-grow">

        {/* Navigation Sidebar */}
        <div className="w-full lg:w-72 flex-shrink-0">
          <h2 className="text-3xl font-medium text-white tracking-tight mb-8">AI Architecture Hub</h2>
          <div className="flex flex-col gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 pl-6 border-l-2 text-left font-light tracking-wide transition-all duration-300 ${activeTab === tab.id
                  ? 'border-white text-white bg-white/[0.03]'
                  : 'border-white/10 text-slate-500 hover:text-slate-300 hover:border-white/40 hover:bg-white/[0.01]'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-grow bg-[#0a0a0a]/60 backdrop-blur-3xl border border-white/5 rounded-[2rem] p-8 md:p-12 relative overflow-hidden min-h-[500px]">

          <AnimatePresence mode="wait">
            {/* AGENTIC AI CONTENT */}
            {activeTab === 'agentic' && (
              <motion.div key="agentic" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4 }} className="h-full flex flex-col justify-center">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center bg-white/5 mb-8"><Network className="text-white/70" size={20} /></div>
                <h3 className="text-3xl font-medium text-white mb-6 tracking-tight">Agent-to-Agent (A2A) Systems</h3>
                <p className="text-slate-400 font-light text-lg leading-relaxed mb-10 max-w-2xl">
                  Beyond prompting LLMs, modern intelligence requires autonomy. Agentic systems orchestrate logic flows, utilize external tools APIs dynamically, and collaborate via sub-agents to synthesize complex enterprise workflows.
                </p>

                <div className="bg-[#111] rounded-2xl p-8 border border-white/5 font-mono text-[11px] md:text-xs text-slate-400">
                  <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/5">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
                    <span className="uppercase tracking-widest text-emerald-400">Execution Block: Copilot Studio Automation</span>
                  </div>
                  <div className="space-y-4">
                    <p><span className="text-slate-600">01</span> User Request {"->"} Primary Orchestrator</p>
                    <p className="text-slate-500 pl-4">{"↳"} Planner Agent formulates multi-step thought process.</p>
                    <p><span className="text-slate-600">02</span> Delegation to Specialists</p>
                    <p className="text-white pl-4">{"↳"} Sub-Agent A: Query Vector Database for HR Policy Context</p>
                    <p className="text-white pl-4">{"↳"} Sub-Agent B: Trigger Azure Logic App Payload</p>
                    <p><span className="text-slate-600">03</span> Synthesis & 95% Automated Resolution.</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* RAG CONTENT */}
            {activeTab === 'rag' && (
              <motion.div key="rag" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4 }} className="h-full flex flex-col justify-center">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center bg-white/5 mb-8"><Database className="text-white/70" size={20} /></div>
                <h3 className="text-3xl font-medium text-white mb-6 tracking-tight">Retrieval-Augmented Generation</h3>
                <p className="text-slate-400 font-light text-lg leading-relaxed mb-10 max-w-3xl">
                  Grounding LLMs in verifiable reality. RAG architecture intercepts user queries, converts them to mathematical embeddings, retrieves semantically identical corporate data from Vector Databases (like Qdrant or Neo4j), and injects truth into the context window.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { title: "Ingestion Pipeline", desc: "Data is chunked and passed through embedding models to create dense numerical vectors representing semantic meaning." },
                    { title: "Vector Storage", desc: "Highly optimized databases (Qdrant, MongoDB) index vectors for sub-millisecond similarity search in high-dimensional space." },
                    { title: "Context Injection", desc: "The top-k most relevant text chunks are appended alongside the user prompt to formulate a hallucination-free response." }
                  ].map((block, i) => (
                    <div key={i} className="bg-[#111] p-6 rounded-2xl border border-white/5">
                      <div className="font-mono text-[10px] text-slate-500 uppercase tracking-widest mb-4">Phase 0{i + 1}</div>
                      <h4 className="text-white font-medium mb-3">{block.title}</h4>
                      <p className="text-slate-400 text-xs font-light leading-relaxed">{block.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* TRANSFORMERS CONTENT */}
            {activeTab === 'transformer' && (
              <motion.div key="transformer" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4 }} className="h-full flex flex-col justify-center">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center bg-white/5 mb-8"><Code2 className="text-white/70" size={20} /></div>
                <h3 className="text-3xl font-medium text-white mb-6 tracking-tight">Transformers & Self-Attention</h3>
                <p className="text-slate-400 font-light text-lg leading-relaxed mb-10 max-w-2xl">
                  The foundational architecture of the modern AI era. By replacing sequential processing (RNNs) with global <strong>Self-Attention</strong> mechanisms, Transformers parse entire matrices of data simultaneously, instantly understanding complex linguistic context.
                </p>

                <div className="bg-[#111] p-8 rounded-2xl border border-white/5 flex flex-col justify-center">
                  <p className="font-mono text-sm md:text-base text-slate-400 text-center leading-loose">
                    The <span className="bg-white/10 text-white px-2 py-1 rounded">animal</span> didn't cross the <span className="text-slate-600">street</span> because <span className="bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]">it</span> was too tired.
                  </p>
                  <p className="text-center font-light text-xs text-slate-500 mt-8 max-w-lg mx-auto">
                    Visualization of attention heads. The model dynamically assigns maximum mathematical weight connecting the pronoun <strong>"it"</strong> back to <strong>"animal"</strong>, completely ignoring "street".
                  </p>
                </div>
              </motion.div>
            )}

            {/* LIVE INFERENCE CONTENT */}
            {activeTab === 'ml' && (
              <motion.div key="ml" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4 }} className="h-full flex flex-col">
                <div className="w-12 h-12 rounded-full border border-cyan-500/20 flex items-center justify-center bg-cyan-500/10 mb-8"><Activity className="text-cyan-400" size={20} /></div>
                <h3 className="text-3xl font-medium text-white mb-4 tracking-tight">In-Browser Edge Computing</h3>
                <p className="text-slate-400 font-light text-sm mb-8 max-w-xl">
                  A DistilBERT transformer loaded into local browser memory via WebAssembly. Zero backend API calls required. Input a string to execute sentiment classification inference locally.
                </p>

                <textarea
                  value={text} onChange={(e) => setText(e.target.value)}
                  placeholder="Input unstructured string for analysis..."
                  className="w-full bg-[#111] border border-white/10 rounded-2xl p-6 text-white focus:outline-none focus:border-cyan-500/50 transition-colors font-mono text-sm resize-none h-40 mb-6"
                />

                <div className="flex flex-wrap gap-4 items-center">
                  <button onClick={analyzeText} disabled={status === 'loading' || status === 'analyzing'} className="px-8 py-4 bg-white text-black font-medium rounded-xl hover:bg-slate-200 disabled:opacity-50 transition-colors shadow-lg shadow-white/5">
                    Compute Status
                  </button>
                  <div className="flex items-center gap-3 px-4 py-3 bg-[#111] border border-white/5 rounded-xl text-xs font-mono uppercase tracking-widest text-slate-500">
                    <div className={`w-2 h-2 rounded-full ${status === 'ready' ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : status === 'analyzing' || status === 'loading' ? 'bg-cyan-500 animate-pulse' : 'bg-slate-700'}`} />
                    Worker: {status}
                  </div>
                </div>

                {result && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 bg-[#111] border border-white/5 p-6 rounded-2xl">
                    <div className="flex justify-between items-end mb-4 font-mono">
                      <div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">Classified State</div>
                        <div className={`text-2xl tracking-widest font-medium ${result.label === 'POSITIVE' ? 'text-emerald-400' : 'text-red-400'}`}>{result.label}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">Probability Weight</div>
                        <div className="text-white text-lg">{(result.score * 100).toFixed(2)}%</div>
                      </div>
                    </div>
                    <div className="w-full bg-[#222] rounded-full h-1 overflow-hidden">
                      <div className={`h-full transition-all duration-1000 ${result.label === 'POSITIVE' ? 'bg-emerald-400' : 'bg-red-400'}`} style={{ width: `${Math.round(result.score * 100)}%` }} />
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

// --- MAIN APP ---
export default function App() {
  const [view, setView] = useState('home');

  return (
    <div className="relative min-h-screen text-slate-50 font-sans selection:bg-white/20 overflow-x-hidden flex flex-col bg-[#020202]">
      <CinematicBackground />
      <main className="flex-grow flex items-center justify-center min-h-screen">
        <AnimatePresence mode="wait">
          {view === 'home' && <ElegantHero key="home" onSelect={setView} />}
          {view === 'about' && <RefinedProfile key="about" onBack={() => setView('home')} onPlayClick={() => setView('play')} />}
          {view === 'play' && <MinimalSandbox key="play" onBack={() => setView('home')} />}
        </AnimatePresence>
      </main>
    </div>
  );
}
