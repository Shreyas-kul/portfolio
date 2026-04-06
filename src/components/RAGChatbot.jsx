import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, ArrowRight } from 'lucide-react';
import { FadeIn } from './FadeIn';

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

      if (!response.ok) throw new Error('Backend is not running or rejected the request');

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
    <FadeIn delay={0.6} className="relative w-full max-w-md h-[440px] flex flex-col glass rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(6,182,212,0.1)] mx-auto lg:ml-auto lg:mr-0 z-20">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/[0.06] bg-white/[0.02] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <BrainCircuit size={16} className="text-cyan-400" />
          </div>
          <div>
            <h3 className="text-white font-medium text-sm">Shreyas.Agent</h3>
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${status === 'ready' ? 'bg-emerald-500' : 'bg-cyan-500 animate-pulse'}`} />
              <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-slate-500">{status}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-grow p-5 overflow-y-auto flex flex-col gap-3" style={{ scrollbarWidth: 'none' }}>
        {messages.map((msg, i) => (
          <div key={i} className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'self-end items-end' : 'self-start items-start'}`}>
            <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
              ? 'bg-white text-black rounded-tr-sm'
              : 'bg-white/[0.04] border border-white/[0.06] text-slate-300 rounded-tl-sm'
            }`}>
              {msg.text}
            </div>
            {msg.meta && (
              <span className="text-[9px] font-mono text-cyan-500/40 uppercase tracking-[0.15em] mt-2 px-1">
                {msg.meta}
              </span>
            )}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="p-4 bg-black/40 border-t border-white/[0.04] relative">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask about my experience..."
          className="w-full bg-white/[0.04] border border-white/[0.08] rounded-full pl-5 pr-14 py-3 text-sm text-white focus:outline-none focus:border-cyan-500/40 transition-colors placeholder:text-slate-600"
        />
        <button type="submit" disabled={!input.trim()} className="absolute right-6 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-cyan-500 text-black flex items-center justify-center disabled:opacity-30 disabled:bg-white/10 disabled:text-white/30 transition-all hover:bg-cyan-400">
          <ArrowRight size={14} />
        </button>
      </form>
    </FadeIn>
  );
};

export default RAGChatbot;
