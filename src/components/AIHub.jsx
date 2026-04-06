import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, Network, Database, Code2 } from 'lucide-react';
import { FadeIn, SectionHeader } from './FadeIn';

const AIHub = () => {
  const [activeTab, setActiveTab] = useState('ml');
  const [status, setStatus] = useState('offline');
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const workerRef = useRef(null);

  useEffect(() => {
    workerRef.current = new Worker(new URL('../worker.js', import.meta.url), { type: 'module' });
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
    { id: 'ml', label: "Browser Inference", icon: <BrainCircuit size={16} /> },
    { id: 'agentic', label: "Agentic Architecture", icon: <Network size={16} /> },
    { id: 'rag', label: "RAG & Vector DBs", icon: <Database size={16} /> },
    { id: 'transformer', label: "Self-Attention", icon: <Code2 size={16} /> }
  ];

  return (
    <section id="ai-hub" className="py-28 relative z-10">
      <div className="section-divider" />
      <div className="max-w-6xl mx-auto px-6 pt-28">
        <SectionHeader label="Interactive" title="AI Architecture Hub" />

        <FadeIn delay={0.2}>
          <div className="flex flex-col lg:flex-row gap-8 glass rounded-[2rem] p-6 md:p-10 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-cyan-600/[0.04] rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-violet-600/[0.03] rounded-full blur-[100px] pointer-events-none" />

            {/* Sidebar tabs */}
            <div className="w-full lg:w-56 flex-shrink-0 flex flex-col gap-1.5">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3.5 pl-5 pr-3 rounded-xl text-left font-light text-sm tracking-wide transition-all duration-300 flex items-center gap-3 ${
                    activeTab === tab.id
                      ? 'text-white bg-white/[0.05] border border-white/[0.08]'
                      : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.02] border border-transparent'
                  }`}
                >
                  <span className={activeTab === tab.id ? 'text-cyan-400' : 'text-slate-600'}>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-grow relative min-h-[400px]">
              <AnimatePresence mode="wait">
                {activeTab === 'ml' && (
                  <motion.div key="ml" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="h-full flex flex-col justify-center">
                    <h4 className="text-2xl font-semibold text-white mb-4 tracking-tight">In-Browser Edge Computing</h4>
                    <p className="text-slate-400 font-light text-sm mb-8 max-w-xl">
                      A DistilBERT transformer loaded into local browser memory via WebAssembly. Zero backend CPU usage. Type below to run inference.
                    </p>
                    <textarea
                      value={text} onChange={(e) => setText(e.target.value)}
                      placeholder="Input text for sentiment analysis... (e.g. 'This portfolio architecture is phenomenal!')"
                      className="w-full bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 text-white focus:outline-none focus:border-cyan-500/40 transition-colors font-mono text-sm resize-none h-28 mb-6 placeholder:text-slate-600"
                    />
                    <div className="flex flex-wrap gap-4 items-center">
                      <button onClick={analyzeText} disabled={status === 'loading' || status === 'analyzing'} className="px-8 py-3 bg-white text-black font-medium rounded-xl hover:bg-slate-100 disabled:opacity-50 transition-all shadow-lg shadow-white/5">
                        Compute Inference
                      </button>
                      <div className="flex items-center gap-3 px-4 py-3 bg-white/[0.03] border border-white/[0.05] rounded-xl text-[10px] font-mono uppercase tracking-[0.15em] text-slate-500">
                        <div className={`w-2 h-2 rounded-full ${status === 'ready' ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : status === 'analyzing' || status === 'loading' ? 'bg-cyan-500 animate-pulse' : 'bg-slate-700'}`} />
                        Module: {status}
                      </div>
                    </div>
                    {result && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 bg-white/[0.03] border border-white/[0.05] p-6 rounded-2xl">
                        <div className="flex justify-between items-end mb-4 font-mono">
                          <div>
                            <div className="text-[10px] text-slate-500 uppercase tracking-[0.15em] mb-1">Classification</div>
                            <div className={`text-xl tracking-wider font-semibold ${result.label === 'POSITIVE' ? 'text-emerald-400' : 'text-red-400'}`}>{result.label}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-[10px] text-slate-500 uppercase tracking-[0.15em] mb-1">Probability</div>
                            <div className="text-white font-mono">{(result.score * 100).toFixed(2)}%</div>
                          </div>
                        </div>
                        <div className="w-full bg-white/[0.05] rounded-full h-1.5 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.round(result.score * 100)}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className={`h-full rounded-full ${result.label === 'POSITIVE' ? 'bg-emerald-400' : 'bg-red-400'}`}
                          />
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'agentic' && (
                  <motion.div key="agentic" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="h-full flex flex-col justify-center">
                    <h3 className="text-2xl font-semibold text-white mb-6 tracking-tight">Agent-to-Agent (A2A) Systems</h3>
                    <p className="text-slate-400 font-light text-base leading-relaxed mb-8 max-w-2xl">
                      Beyond prompting LLMs, modern intelligence requires autonomy. Agentic systems orchestrate logic flows, utilize APIs dynamically, and collaborate via sub-agents.
                    </p>
                    <div className="bg-white/[0.03] rounded-2xl p-6 border border-white/[0.05] font-mono text-xs text-slate-400">
                      <div className="flex items-center gap-4 mb-4 pb-4 border-b border-white/[0.05]">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                        <span className="uppercase text-emerald-400 tracking-[0.1em]">Azure Copilot Automation</span>
                      </div>
                      <div className="space-y-3">
                        <p><span className="text-slate-600">01</span> Orchestrator {"→"} Formulates multi-step logic.</p>
                        <p className="text-white pl-4">{"↳"} Sub-Agent A: Query Vector DB for context.</p>
                        <p className="text-white pl-4">{"↳"} Sub-Agent B: Trigger Logic App Payload.</p>
                        <p><span className="text-slate-600">02</span> Synergy yields 95% Automated HR Resolution.</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'rag' && (
                  <motion.div key="rag" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="h-full flex flex-col justify-center">
                    <h3 className="text-2xl font-semibold text-white mb-6 tracking-tight">Retrieval-Augmented Generation</h3>
                    <p className="text-slate-400 font-light text-base leading-relaxed mb-8">
                      Grounding LLMs in verifiable reality. RAG converts queries to embeddings, retrieves semantically relevant data from Vector DBs, and injects truth to stop hallucinations.
                    </p>
                    <div className="grid md:grid-cols-3 gap-4">
                      {[
                        { title: "Ingestion", desc: "Data chunked into dense semantic vectors." },
                        { title: "Storage", desc: "Qdrant/Neo4j index vectors for similarity search." },
                        { title: "Injection", desc: "Top-k chunks appended to formulate response." }
                      ].map((b, i) => (
                        <div key={i} className="bg-white/[0.03] p-5 rounded-2xl border border-white/[0.05] hover:border-white/10 transition-colors">
                          <h4 className="text-white font-medium text-sm mb-2">{b.title}</h4>
                          <p className="text-slate-400 text-xs font-light">{b.desc}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'transformer' && (
                  <motion.div key="transformer" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="h-full flex flex-col justify-center">
                    <h3 className="text-2xl font-semibold text-white mb-6 tracking-tight">Transformers & Self-Attention</h3>
                    <p className="text-slate-400 font-light text-base leading-relaxed mb-8">
                      The foundational architecture of the modern AI era. By replacing sequential processing with global Self-Attention, Transformers parse entire matrices of data simultaneously.
                    </p>
                    <div className="bg-white/[0.03] p-8 rounded-2xl border border-white/[0.05] text-center">
                      <p className="font-mono text-sm text-slate-400 leading-loose">
                        The <span className="bg-white/[0.08] text-white px-2 py-1 rounded">animal</span> didn't cross the street because <span className="border border-cyan-500/50 text-cyan-400 px-2 py-1 rounded shadow-[0_0_12px_rgba(6,182,212,0.2)]">it</span> was too tired.
                      </p>
                      <p className="text-xs text-slate-500 mt-6">Model dynamically maps "it" to "animal", ignoring "street".</p>
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

export default AIHub;
