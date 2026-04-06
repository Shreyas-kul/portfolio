import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, Network, Database, Code2, X, Zap, Cpu, GitBranch, Layers, ChevronRight } from 'lucide-react';
import { FadeIn, SectionHeader } from './FadeIn';

/* ───────────────────────────────────────────────
   NEURAL NETWORK DATA
   ─────────────────────────────────────────────── */
const NEURAL_NODES = [
  // Inference cluster (cyan)
  { id: 'inference', label: 'Edge Inference', category: 'inference', radius: 22, cx: 0.12, cy: 0.3, detail: 'inference' },
  { id: 'distilbert', label: 'DistilBERT', category: 'inference', radius: 14, cx: 0.08, cy: 0.55, detail: 'inference' },
  { id: 'wasm', label: 'WebAssembly', category: 'inference', radius: 12, cx: 0.18, cy: 0.6, detail: 'inference' },
  { id: 'onnx', label: 'ONNX Runtime', category: 'inference', radius: 11, cx: 0.06, cy: 0.75, detail: 'inference' },
  { id: 'quantize', label: 'Quantization', category: 'inference', radius: 10, cx: 0.2, cy: 0.8, detail: 'inference' },

  // Agentic cluster (violet)
  { id: 'agentic', label: 'Agentic AI', category: 'agentic', radius: 24, cx: 0.38, cy: 0.22, detail: 'agentic' },
  { id: 'orchestrator', label: 'Orchestrator', category: 'agentic', radius: 15, cx: 0.3, cy: 0.42, detail: 'agentic' },
  { id: 'subagent', label: 'Sub-Agents', category: 'agentic', radius: 13, cx: 0.42, cy: 0.48, detail: 'agentic' },
  { id: 'tooluse', label: 'Tool Use', category: 'agentic', radius: 11, cx: 0.28, cy: 0.65, detail: 'agentic' },
  { id: 'reasoning', label: 'Chain-of-Thought', category: 'agentic', radius: 12, cx: 0.45, cy: 0.7, detail: 'agentic' },

  // RAG cluster (emerald)
  { id: 'rag', label: 'RAG Pipeline', category: 'rag', radius: 22, cx: 0.62, cy: 0.25, detail: 'rag' },
  { id: 'embeddings', label: 'Embeddings', category: 'rag', radius: 14, cx: 0.58, cy: 0.5, detail: 'rag' },
  { id: 'vectordb', label: 'Vector DB', category: 'rag', radius: 15, cx: 0.7, cy: 0.52, detail: 'rag' },
  { id: 'chunking', label: 'Chunking', category: 'rag', radius: 11, cx: 0.55, cy: 0.72, detail: 'rag' },
  { id: 'retrieval', label: 'Semantic Search', category: 'rag', radius: 12, cx: 0.72, cy: 0.75, detail: 'rag' },

  // Transformer cluster (amber)
  { id: 'transformer', label: 'Transformers', category: 'transformer', radius: 22, cx: 0.88, cy: 0.3, detail: 'transformer' },
  { id: 'attention', label: 'Self-Attention', category: 'transformer', radius: 15, cx: 0.82, cy: 0.5, detail: 'transformer' },
  { id: 'ffn', label: 'Feed-Forward', category: 'transformer', radius: 12, cx: 0.92, cy: 0.55, detail: 'transformer' },
  { id: 'positional', label: 'Pos. Encoding', category: 'transformer', radius: 11, cx: 0.85, cy: 0.72, detail: 'transformer' },
  { id: 'multihead', label: 'Multi-Head', category: 'transformer', radius: 13, cx: 0.94, cy: 0.78, detail: 'transformer' },

  // Central hub
  { id: 'llm', label: 'Large Language Model', category: 'hub', radius: 28, cx: 0.5, cy: 0.42, detail: null },
];

const NEURAL_CONNECTIONS = [
  // Inference cluster
  ['inference', 'distilbert'], ['inference', 'wasm'], ['distilbert', 'onnx'],
  ['wasm', 'quantize'], ['distilbert', 'wasm'],
  // Agentic cluster
  ['agentic', 'orchestrator'], ['agentic', 'subagent'], ['orchestrator', 'tooluse'],
  ['subagent', 'reasoning'], ['orchestrator', 'subagent'],
  // RAG cluster
  ['rag', 'embeddings'], ['rag', 'vectordb'], ['embeddings', 'chunking'],
  ['vectordb', 'retrieval'], ['embeddings', 'vectordb'],
  // Transformer cluster
  ['transformer', 'attention'], ['transformer', 'ffn'], ['attention', 'positional'],
  ['ffn', 'multihead'], ['attention', 'multihead'],
  // Cross-cluster connections to hub
  ['inference', 'llm'], ['agentic', 'llm'], ['rag', 'llm'], ['transformer', 'llm'],
  // Inter-cluster connections
  ['agentic', 'rag'], ['transformer', 'inference'], ['rag', 'transformer'],
  ['orchestrator', 'embeddings'], ['attention', 'distilbert'],
];

const CATEGORY_COLORS = {
  inference: { main: '#22d3ee', glow: 'rgba(34,211,238,', bg: 'rgba(34,211,238,0.08)' },
  agentic:   { main: '#a78bfa', glow: 'rgba(167,139,250,', bg: 'rgba(167,139,250,0.08)' },
  rag:       { main: '#34d399', glow: 'rgba(52,211,153,', bg: 'rgba(52,211,153,0.08)' },
  transformer: { main: '#fbbf24', glow: 'rgba(251,191,36,', bg: 'rgba(251,191,36,0.08)' },
  hub:       { main: '#f472b6', glow: 'rgba(244,114,182,', bg: 'rgba(244,114,182,0.08)' },
};

/* ───────────────────────────────────────────────
   DETAIL PANEL CONTENT
   ─────────────────────────────────────────────── */
const DETAIL_CONTENT = {
  inference: {
    icon: <Cpu size={20} />,
    title: 'In-Browser Edge Inference',
    subtitle: 'Zero-latency AI directly in your browser',
    description: 'DistilBERT transformers compiled to WebAssembly and quantized to INT8, running entirely in local browser memory. No server round-trips. No GPU rental. Pure edge computing — the model weights are cached in IndexedDB after first load for instant subsequent inference.',
    metrics: [
      { label: 'Latency', value: '<50ms' },
      { label: 'Model Size', value: '67MB' },
      { label: 'Backend', value: 'None' },
    ],
    pipeline: ['Input Text', 'Tokenizer', 'DistilBERT', 'Softmax', 'Classification'],
    color: 'cyan',
  },
  agentic: {
    icon: <GitBranch size={20} />,
    title: 'Agentic AI Architecture',
    subtitle: 'Autonomous multi-agent orchestration',
    description: 'Beyond simple prompting — agentic systems decompose complex goals into sub-tasks, delegate to specialized agents, and synthesize results. Built with LangGraph and AutoGen, these architectures handle real enterprise workflows: querying CRM data, triggering Logic Apps, and generating contextual reports autonomously.',
    metrics: [
      { label: 'Automation', value: '95%' },
      { label: 'Agents', value: 'Multi' },
      { label: 'Protocol', value: 'A2A' },
    ],
    pipeline: ['User Intent', 'Orchestrator', 'Sub-Agent A', 'Sub-Agent B', 'Synthesis'],
    color: 'violet',
  },
  rag: {
    icon: <Database size={20} />,
    title: 'RAG & Vector Databases',
    subtitle: 'Grounding LLMs in verifiable truth',
    description: 'Retrieval-Augmented Generation eliminates hallucinations by injecting real data into the generation context. Documents are chunked, embedded into dense vectors via sentence-transformers, stored in Qdrant/Neo4j, and retrieved via cosine similarity. Top-k chunks are prepended to the prompt, grounding every response in verified knowledge.',
    metrics: [
      { label: 'Accuracy', value: '98%' },
      { label: 'Vector DB', value: 'Qdrant' },
      { label: 'Chunks', value: 'Top-K' },
    ],
    pipeline: ['Documents', 'Chunking', 'Embedding', 'Vector Store', 'Retrieval', 'LLM Generation'],
    color: 'emerald',
  },
  transformer: {
    icon: <Layers size={20} />,
    title: 'Transformers & Self-Attention',
    subtitle: 'The architecture behind modern AI',
    description: 'Self-attention computes relationships between every token pair simultaneously, replacing sequential RNN processing with O(1) parallel depth. Multi-head attention learns diverse feature subspaces — syntactic, semantic, positional — enabling models like GPT-4 and Claude to reason over million-token contexts with emergent capabilities.',
    metrics: [
      { label: 'Complexity', value: 'O(n²)' },
      { label: 'Heads', value: '8-128' },
      { label: 'Params', value: 'B-scale' },
    ],
    pipeline: ['Tokens', 'Positional Enc.', 'Q·K·V Projection', 'Attention Weights', 'Output'],
    color: 'amber',
  },
};

/* ───────────────────────────────────────────────
   NEURAL NETWORK CANVAS
   ─────────────────────────────────────────────── */
const NeuralCanvas = ({ onNodeClick, activeDetail, hoveredNode, setHoveredNode }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const nodesRef = useRef([]);
  const particlesRef = useRef([]);
  const timeRef = useRef(0);
  const dimensionsRef = useRef({ w: 0, h: 0 });

  // Initialize nodes with absolute positions
  const initNodes = useCallback((w, h) => {
    nodesRef.current = NEURAL_NODES.map(n => ({
      ...n,
      x: n.cx * w,
      y: n.cy * h,
      baseX: n.cx * w,
      baseY: n.cy * h,
      vx: 0, vy: 0,
      phase: Math.random() * Math.PI * 2,
      pulsePhase: Math.random() * Math.PI * 2,
    }));
  }, []);

  // Initialize data particles
  const initParticles = useCallback(() => {
    const particles = [];
    for (let i = 0; i < 40; i++) {
      const conn = NEURAL_CONNECTIONS[Math.floor(Math.random() * NEURAL_CONNECTIONS.length)];
      particles.push({
        fromId: conn[0],
        toId: conn[1],
        progress: Math.random(),
        speed: 0.002 + Math.random() * 0.004,
        size: 1.5 + Math.random() * 2,
        opacity: 0.4 + Math.random() * 0.6,
      });
    }
    particlesRef.current = particles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      dimensionsRef.current = { w: rect.width, h: rect.height };
      initNodes(rect.width, rect.height);
      initParticles();
    };

    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };

      // Check hover
      const nodes = nodesRef.current;
      let found = null;
      for (const node of nodes) {
        const dx = mouseRef.current.x - node.x;
        const dy = mouseRef.current.y - node.y;
        if (Math.sqrt(dx * dx + dy * dy) < node.radius + 8) {
          found = node.id;
          break;
        }
      }
      setHoveredNode(found);
    };

    const handleClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const nodes = nodesRef.current;
      for (const node of nodes) {
        const dx = mx - node.x;
        const dy = my - node.y;
        if (Math.sqrt(dx * dx + dy * dy) < node.radius + 8 && node.detail) {
          onNodeClick(node.detail);
          return;
        }
      }
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
      setHoveredNode(null);
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // Animation loop
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    const animate = () => {
      timeRef.current += 0.016;
      const t = timeRef.current;
      const { w, h } = dimensionsRef.current;
      const nodes = nodesRef.current;
      const mouse = mouseRef.current;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(dpr, dpr);

      // ─── HUD Grid ───
      ctx.strokeStyle = 'rgba(34,211,238,0.03)';
      ctx.lineWidth = 0.5;
      const gridSize = 60;
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // ─── Scanline ───
      const scanY = (t * 40) % (h + 60) - 30;
      const scanGrad = ctx.createLinearGradient(0, scanY - 30, 0, scanY + 30);
      scanGrad.addColorStop(0, 'rgba(34,211,238,0)');
      scanGrad.addColorStop(0.5, 'rgba(34,211,238,0.04)');
      scanGrad.addColorStop(1, 'rgba(34,211,238,0)');
      ctx.fillStyle = scanGrad;
      ctx.fillRect(0, scanY - 30, w, 60);

      // ─── Update node positions (organic float + mouse repulsion) ───
      for (const node of nodes) {
        // Organic floating
        node.x = node.baseX + Math.sin(t * 0.5 + node.phase) * 8;
        node.y = node.baseY + Math.cos(t * 0.4 + node.phase * 1.3) * 6;

        // Mouse proximity — attraction for nearby, gentle push far
        const dx = mouse.x - node.x;
        const dy = mouse.y - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150 && dist > 0) {
          const force = (150 - dist) / 150 * 3;
          node.x += (dx / dist) * force;
          node.y += (dy / dist) * force;
        }
      }

      // ─── Draw connections ───
      const nodeMap = {};
      for (const n of nodes) nodeMap[n.id] = n;

      for (const [fromId, toId] of NEURAL_CONNECTIONS) {
        const from = nodeMap[fromId];
        const to = nodeMap[toId];
        if (!from || !to) continue;

        const catColor = CATEGORY_COLORS[from.category] || CATEGORY_COLORS.hub;
        const isActive = activeDetail && (from.detail === activeDetail || to.detail === activeDetail);
        const isHovered = hoveredNode && (from.id === hoveredNode || to.id === hoveredNode);

        // Flowing gradient
        const grad = ctx.createLinearGradient(from.x, from.y, to.x, to.y);
        const flowT = (t * 0.5) % 1;
        const baseAlpha = isActive ? 0.4 : isHovered ? 0.3 : 0.08;

        grad.addColorStop(0, `${catColor.glow}${baseAlpha})`);
        grad.addColorStop(Math.max(0, flowT - 0.15), `${catColor.glow}${baseAlpha})`);
        grad.addColorStop(flowT, `${catColor.glow}${Math.min(baseAlpha + 0.3, 0.7)})`);
        grad.addColorStop(Math.min(1, flowT + 0.15), `${catColor.glow}${baseAlpha})`);
        grad.addColorStop(1, `${catColor.glow}${baseAlpha})`);

        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = isActive ? 2 : isHovered ? 1.5 : 0.8;
        ctx.stroke();
      }

      // ─── Draw data particles ───
      for (const p of particlesRef.current) {
        p.progress += p.speed;
        if (p.progress > 1) {
          p.progress = 0;
          const conn = NEURAL_CONNECTIONS[Math.floor(Math.random() * NEURAL_CONNECTIONS.length)];
          p.fromId = conn[0];
          p.toId = conn[1];
          p.speed = 0.002 + Math.random() * 0.004;
        }

        const from = nodeMap[p.fromId];
        const to = nodeMap[p.toId];
        if (!from || !to) continue;

        const px = from.x + (to.x - from.x) * p.progress;
        const py = from.y + (to.y - from.y) * p.progress;
        const catColor = CATEGORY_COLORS[from.category] || CATEGORY_COLORS.hub;

        const isActive = activeDetail && (from.detail === activeDetail || to.detail === activeDetail);

        ctx.beginPath();
        ctx.arc(px, py, p.size * (isActive ? 1.5 : 1), 0, Math.PI * 2);
        ctx.fillStyle = `${catColor.glow}${p.opacity * (isActive ? 1 : 0.6)})`;
        ctx.fill();

        // Glow trail
        ctx.beginPath();
        ctx.arc(px, py, p.size * 3 * (isActive ? 2 : 1), 0, Math.PI * 2);
        ctx.fillStyle = `${catColor.glow}${p.opacity * 0.1})`;
        ctx.fill();
      }

      // ─── Draw nodes ───
      for (const node of nodes) {
        const catColor = CATEGORY_COLORS[node.category];
        const isActive = activeDetail && node.detail === activeDetail;
        const isHovered = hoveredNode === node.id;
        const pulse = Math.sin(t * 2 + node.pulsePhase) * 0.3 + 0.7;

        // Outer glow ring
        if (isActive || isHovered) {
          for (let ring = 3; ring >= 1; ring--) {
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius + ring * 8, 0, Math.PI * 2);
            ctx.strokeStyle = `${catColor.glow}${0.04 * ring * pulse})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        // Heartbeat pulse ring
        const heartbeat = ((t * 1.5 + node.pulsePhase) % 3);
        if (heartbeat < 1.5) {
          const hbScale = heartbeat / 1.5;
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius + hbScale * 20, 0, Math.PI * 2);
          ctx.strokeStyle = `${catColor.glow}${(1 - hbScale) * 0.15})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Node body
        const nodeGrad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.radius);
        const bodyAlpha = isActive ? 0.6 : isHovered ? 0.4 : 0.15 + pulse * 0.1;
        nodeGrad.addColorStop(0, `${catColor.glow}${bodyAlpha})`);
        nodeGrad.addColorStop(1, `${catColor.glow}0.02)`);

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = nodeGrad;
        ctx.fill();

        // Node border
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `${catColor.glow}${isActive ? 0.8 : isHovered ? 0.6 : 0.2 + pulse * 0.1})`;
        ctx.lineWidth = isActive ? 2 : 1;
        ctx.stroke();

        // Core dot
        ctx.beginPath();
        ctx.arc(node.x, node.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = catColor.main;
        ctx.fill();
      }

      ctx.restore();
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleClick);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [initNodes, initParticles, onNodeClick, activeDetail, hoveredNode, setHoveredNode]);

  return (
    <div ref={containerRef} className="neural-canvas-container relative w-full" style={{ height: '520px' }}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ cursor: hoveredNode ? 'pointer' : 'crosshair' }}
      />
      {/* Floating labels rendered as HTML for crisp text */}
      <NodeLabels hoveredNode={hoveredNode} activeDetail={activeDetail} />
    </div>
  );
};

/* ───────────────────────────────────────────────
   FLOATING LABELS (HTML overlay)
   ─────────────────────────────────────────────── */
const NodeLabels = ({ hoveredNode, activeDetail }) => {
  const containerRef = useRef(null);
  const [dims, setDims] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const update = () => {
      const parent = containerRef.current?.parentElement;
      if (parent) {
        const rect = parent.getBoundingClientRect();
        setDims({ w: rect.width, h: rect.height });
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Only show labels for major nodes
  const majorNodes = NEURAL_NODES.filter(n => n.radius >= 14);

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden">
      {dims.w > 0 && majorNodes.map(node => {
        const x = node.cx * dims.w;
        const y = node.cy * dims.h;
        const catColor = CATEGORY_COLORS[node.category];
        const isActive = activeDetail && node.detail === activeDetail;
        const isHovered = hoveredNode === node.id;
        const showLabel = isActive || isHovered || node.radius >= 18;

        return (
          <div
            key={node.id}
            className="absolute transition-all duration-500"
            style={{
              left: `${x}px`,
              top: `${y + node.radius + 12}px`,
              transform: 'translateX(-50%)',
              opacity: showLabel ? 1 : 0.4,
            }}
          >
            <span
              className="whitespace-nowrap text-[9px] font-mono uppercase tracking-[0.18em] px-2 py-0.5 rounded"
              style={{
                color: isActive || isHovered ? catColor.main : 'rgba(148,163,184,0.6)',
                background: isActive ? catColor.bg : 'transparent',
                textShadow: isActive ? `0 0 12px ${catColor.main}` : 'none',
              }}
            >
              {node.label}
            </span>
          </div>
        );
      })}

      {/* HUD corner markers */}
      <div className="absolute top-4 left-4 text-[9px] font-mono uppercase tracking-[0.2em] text-cyan-500/30">
        <span className="neural-hud-blink">◉</span> Neural Architecture Map
      </div>
      <div className="absolute top-4 right-4 text-[9px] font-mono uppercase tracking-[0.2em] text-cyan-500/20">
        Nodes: {NEURAL_NODES.length} &nbsp;|&nbsp; Synapses: {NEURAL_CONNECTIONS.length}
      </div>
      <div className="absolute bottom-4 left-4 text-[9px] font-mono uppercase tracking-[0.2em] text-cyan-500/20">
        Click a node to explore
      </div>
      <div className="absolute bottom-4 right-4 text-[9px] font-mono uppercase tracking-[0.2em] text-slate-600">
        Live Visualization
      </div>
    </div>
  );
};

/* ───────────────────────────────────────────────
   ANIMATED PIPELINE
   ─────────────────────────────────────────────── */
const AnimatedPipeline = ({ steps, color }) => {
  const colorMap = {
    cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400', glow: 'shadow-cyan-500/20', arrow: 'text-cyan-500/40' },
    violet: { bg: 'bg-violet-500/10', border: 'border-violet-500/30', text: 'text-violet-400', glow: 'shadow-violet-500/20', arrow: 'text-violet-500/40' },
    emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', glow: 'shadow-emerald-500/20', arrow: 'text-emerald-500/40' },
    amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', glow: 'shadow-amber-500/20', arrow: 'text-amber-500/40' },
  };
  const c = colorMap[color] || colorMap.cyan;

  return (
    <div className="flex flex-wrap items-center gap-2 mt-6">
      {steps.map((step, i) => (
        <React.Fragment key={i}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.12, duration: 0.4 }}
            className={`px-3 py-1.5 rounded-lg ${c.bg} border ${c.border} ${c.text} text-[10px] font-mono uppercase tracking-widest shadow-lg ${c.glow}`}
          >
            {step}
          </motion.div>
          {i < steps.length - 1 && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 + i * 0.12 }}
              className={`${c.arrow}`}
            >
              <ChevronRight size={14} />
            </motion.span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

/* ───────────────────────────────────────────────
   ATTENTION VISUALIZATION
   ─────────────────────────────────────────────── */
const AttentionViz = () => {
  const tokens = ['The', 'model', 'learns', 'to', 'attend', 'to', 'relevant', 'tokens'];
  // Simulated attention weights (from token index to token index)
  const attentionPairs = [
    [0, 1, 0.8], [1, 2, 0.6], [2, 4, 0.9], [4, 6, 0.95],
    [6, 7, 0.7], [1, 6, 0.5], [0, 4, 0.3], [2, 7, 0.4],
  ];

  return (
    <div className="mt-6 bg-white/[0.02] rounded-2xl border border-white/[0.05] p-6 overflow-hidden">
      <div className="text-[10px] font-mono uppercase tracking-[0.15em] text-amber-400/60 mb-4">Self-Attention Weights</div>
      <div className="relative">
        {/* Token row */}
        <div className="flex justify-between mb-8">
          {tokens.map((token, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.06 }}
              className="relative z-10"
            >
              <span className="px-2 py-1 bg-white/[0.04] border border-white/[0.08] rounded text-xs font-mono text-white">
                {token}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Attention arcs (SVG) */}
        <svg className="absolute top-0 left-0 w-full h-20 pointer-events-none" style={{ top: '28px' }}>
          {attentionPairs.map(([from, to, weight], i) => {
            const x1 = (from / (tokens.length - 1)) * 100;
            const x2 = (to / (tokens.length - 1)) * 100;
            const midX = (x1 + x2) / 2;
            const arcHeight = Math.abs(x2 - x1) * 0.6;

            return (
              <motion.path
                key={i}
                d={`M ${x1}% 0 Q ${midX}% ${arcHeight}% ${x2}% 0`}
                fill="none"
                stroke={`rgba(251,191,36,${weight * 0.5})`}
                strokeWidth={weight * 2.5}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ delay: 0.4 + i * 0.1, duration: 0.6 }}
              />
            );
          })}
        </svg>

        {/* Weight legend */}
        <div className="flex items-center gap-4 mt-2 text-[9px] font-mono text-slate-500">
          <span>Weak</span>
          <div className="flex gap-0.5">
            {[0.1, 0.3, 0.5, 0.7, 0.9].map((w, i) => (
              <div key={i} className="w-6 h-1.5 rounded-full" style={{ background: `rgba(251,191,36,${w})` }} />
            ))}
          </div>
          <span>Strong</span>
        </div>
      </div>
    </div>
  );
};

/* ───────────────────────────────────────────────
   AGENTIC FLOW VISUALIZATION
   ─────────────────────────────────────────────── */
const AgenticFlow = () => {
  const agents = [
    { name: 'Orchestrator', status: 'active', desc: 'Decomposes user intent into sub-tasks' },
    { name: 'Retriever Agent', status: 'working', desc: 'Queries Vector DB for context' },
    { name: 'Logic Agent', status: 'working', desc: 'Triggers Logic App + Power Automate' },
    { name: 'Synthesizer', status: 'pending', desc: 'Merges sub-agent results into response' },
  ];

  return (
    <div className="mt-6 space-y-3">
      {agents.map((agent, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 + i * 0.15 }}
          className="flex items-center gap-4 bg-white/[0.02] border border-white/[0.05] rounded-xl p-4 hover:border-violet-500/20 transition-all group"
        >
          <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
            agent.status === 'active' ? 'bg-emerald-400 shadow-[0_0_10px_#34d399] neural-hud-blink' :
            agent.status === 'working' ? 'bg-violet-400 shadow-[0_0_8px_#a78bfa] animate-pulse' :
            'bg-slate-600'
          }`} />
          <div className="flex-grow min-w-0">
            <div className="text-sm text-white font-medium">{agent.name}</div>
            <div className="text-[11px] text-slate-500 font-light">{agent.desc}</div>
          </div>
          <span className={`text-[9px] font-mono uppercase tracking-widest ${
            agent.status === 'active' ? 'text-emerald-400' :
            agent.status === 'working' ? 'text-violet-400' :
            'text-slate-600'
          }`}>{agent.status}</span>
        </motion.div>
      ))}
    </div>
  );
};

/* ───────────────────────────────────────────────
   BROWSER INFERENCE (preserved from original)
   ─────────────────────────────────────────────── */
const BrowserInference = () => {
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

  return (
    <div className="mt-6">
      <textarea
        value={text} onChange={(e) => setText(e.target.value)}
        placeholder="Type text for sentiment analysis... (e.g. 'This neural architecture is phenomenal!')"
        className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-white focus:outline-none focus:border-cyan-500/40 transition-colors font-mono text-sm resize-none h-24 placeholder:text-slate-600"
      />
      <div className="flex flex-wrap gap-3 items-center mt-4">
        <button onClick={analyzeText} disabled={status === 'loading' || status === 'analyzing'} className="px-6 py-2.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-medium text-sm rounded-lg hover:bg-cyan-500/20 disabled:opacity-50 transition-all">
          <Zap size={14} className="inline mr-2" />Run Inference
        </button>
        <span className="flex items-center gap-2 px-3 py-2 bg-white/[0.02] border border-white/[0.04] rounded-lg text-[9px] font-mono uppercase tracking-[0.15em] text-slate-500">
          <span className={`w-1.5 h-1.5 rounded-full ${status === 'ready' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : status === 'analyzing' || status === 'loading' ? 'bg-cyan-500 animate-pulse' : 'bg-slate-700'}`} />
          {status}
        </span>
      </div>
      {result && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-5 bg-white/[0.03] border border-white/[0.05] p-5 rounded-xl">
          <div className="flex justify-between items-end mb-3">
            <div>
              <div className="text-[9px] text-slate-500 uppercase tracking-[0.15em] mb-1">Classification</div>
              <div className={`text-lg tracking-wider font-semibold ${result.label === 'POSITIVE' ? 'text-emerald-400' : 'text-red-400'}`}>{result.label}</div>
            </div>
            <div className="text-right">
              <div className="text-[9px] text-slate-500 uppercase tracking-[0.15em] mb-1">Probability</div>
              <div className="text-white font-mono text-sm">{(result.score * 100).toFixed(2)}%</div>
            </div>
          </div>
          <div className="w-full bg-white/[0.05] rounded-full h-1 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.round(result.score * 100)}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-full rounded-full ${result.label === 'POSITIVE' ? 'bg-emerald-400' : 'bg-red-400'}`}
            />
          </div>
        </motion.div>
      )}
    </div>
  );
};

/* ───────────────────────────────────────────────
   DETAIL PANEL
   ─────────────────────────────────────────────── */
const DetailPanel = ({ detail, onClose }) => {
  const content = DETAIL_CONTENT[detail];
  if (!content) return null;

  const colorMap = {
    cyan: 'text-cyan-400 border-cyan-500/30',
    violet: 'text-violet-400 border-violet-500/30',
    emerald: 'text-emerald-400 border-emerald-500/30',
    amber: 'text-amber-400 border-amber-500/30',
  };
  const metricBg = {
    cyan: 'bg-cyan-500/5 border-cyan-500/15',
    violet: 'bg-violet-500/5 border-violet-500/15',
    emerald: 'bg-emerald-500/5 border-emerald-500/15',
    amber: 'bg-amber-500/5 border-amber-500/15',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.97 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="mt-8 relative"
    >
      {/* Glow backdrop */}
      <div className={`absolute inset-0 rounded-2xl blur-[80px] opacity-20`}
        style={{ background: CATEGORY_COLORS[detail === 'inference' ? 'inference' : detail === 'agentic' ? 'agentic' : detail === 'rag' ? 'rag' : 'transformer']?.main }}
      />

      <div className="relative bg-[#0a0a0f]/80 backdrop-blur-2xl rounded-2xl border border-white/[0.06] p-8 overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-slate-500 hover:text-white hover:border-white/20 transition-all z-10"
        >
          <X size={14} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <span className={colorMap[content.color]}>{content.icon}</span>
          <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-slate-500">{content.subtitle}</span>
        </div>
        <h4 className="text-2xl font-semibold text-white tracking-tight mb-4">{content.title}</h4>
        <p className="text-slate-400 font-light text-sm leading-relaxed max-w-3xl mb-6">{content.description}</p>

        {/* Metrics */}
        <div className="flex flex-wrap gap-3 mb-4">
          {content.metrics.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className={`px-4 py-2 rounded-lg border ${metricBg[content.color]} flex items-center gap-2`}
            >
              <span className={`font-mono text-sm font-semibold ${colorMap[content.color].split(' ')[0]}`}>{m.value}</span>
              <span className="text-slate-500 text-[9px] font-mono uppercase tracking-widest">{m.label}</span>
            </motion.div>
          ))}
        </div>

        {/* Pipeline visualization */}
        <div className="text-[9px] font-mono uppercase tracking-[0.15em] text-slate-600 mb-1 mt-6">Data Flow Pipeline</div>
        <AnimatedPipeline steps={content.pipeline} color={content.color} />

        {/* Specialized visualization per detail type */}
        {detail === 'inference' && <BrowserInference />}
        {detail === 'agentic' && <AgenticFlow />}
        {detail === 'transformer' && <AttentionViz />}
        {detail === 'rag' && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { title: "Ingestion", desc: "PDF/HTML/API data split into optimally-sized semantic chunks via recursive character splitting.", icon: "📄" },
              { title: "Embedding", desc: "Each chunk transformed into 768-dim dense vectors via sentence-transformers (all-MiniLM-L6-v2).", icon: "🧬" },
              { title: "Retrieval", desc: "Cosine similarity over HNSW index returns top-k chunks in <10ms. Injected into LLM context.", icon: "🔍" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.12 }}
                className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-5 hover:border-emerald-500/20 transition-all"
              >
                <div className="text-2xl mb-3">{item.icon}</div>
                <h5 className="text-sm font-medium text-white mb-1.5">{item.title}</h5>
                <p className="text-xs text-slate-500 font-light leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

/* ───────────────────────────────────────────────
   CLUSTER LEGEND
   ─────────────────────────────────────────────── */
const ClusterLegend = ({ activeDetail, onSelect }) => {
  const clusters = [
    { id: 'inference', label: 'Edge Inference', icon: <Cpu size={14} />, color: CATEGORY_COLORS.inference.main },
    { id: 'agentic', label: 'Agentic AI', icon: <Network size={14} />, color: CATEGORY_COLORS.agentic.main },
    { id: 'rag', label: 'RAG Pipeline', icon: <Database size={14} />, color: CATEGORY_COLORS.rag.main },
    { id: 'transformer', label: 'Transformers', icon: <Layers size={14} />, color: CATEGORY_COLORS.transformer.main },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-2 mt-6">
      {clusters.map(c => (
        <button
          key={c.id}
          onClick={() => onSelect(activeDetail === c.id ? null : c.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-mono uppercase tracking-[0.12em] transition-all duration-300 border ${
            activeDetail === c.id
              ? 'bg-white/[0.06] border-white/[0.12] text-white'
              : 'bg-white/[0.02] border-white/[0.04] text-slate-500 hover:text-slate-300 hover:border-white/[0.08]'
          }`}
        >
          <span style={{ color: c.color }}>{c.icon}</span>
          {c.label}
        </button>
      ))}
    </div>
  );
};

/* ───────────────────────────────────────────────
   MAIN COMPONENT
   ─────────────────────────────────────────────── */
const AIHub = () => {
  const [activeDetail, setActiveDetail] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);

  const handleNodeClick = useCallback((detail) => {
    setActiveDetail(prev => prev === detail ? null : detail);
  }, []);

  return (
    <section id="ai-hub" className="py-28 relative z-10">
      <div className="section-divider" />
      <div className="max-w-7xl mx-auto px-6 pt-28">
        <SectionHeader label="Live Neural Network" title="AI Architecture Hub" />

        <FadeIn delay={0.2}>
          <p className="text-center text-slate-400 font-light text-sm max-w-2xl mx-auto -mt-8 mb-10">
            An interactive visualization of the AI/ML architectures I work with.
            Each node represents a concept — hover to highlight, click to explore in depth.
          </p>
        </FadeIn>

        <FadeIn delay={0.3}>
          <div className="neural-network-wrapper glass rounded-[2rem] overflow-hidden relative">
            {/* Ambient glow effects */}
            <div className="absolute top-0 left-[10%] w-[30rem] h-[30rem] bg-cyan-600/[0.04] rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-[10%] w-[25rem] h-[25rem] bg-violet-600/[0.03] rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-[30%] right-[30%] w-[20rem] h-[20rem] bg-emerald-600/[0.02] rounded-full blur-[100px] pointer-events-none" />

            {/* Neural canvas */}
            <NeuralCanvas
              onNodeClick={handleNodeClick}
              activeDetail={activeDetail}
              hoveredNode={hoveredNode}
              setHoveredNode={setHoveredNode}
            />
          </div>
        </FadeIn>

        {/* Cluster legend / quick select */}
        <FadeIn delay={0.4}>
          <ClusterLegend activeDetail={activeDetail} onSelect={setActiveDetail} />
        </FadeIn>

        {/* Expandable detail panel */}
        <AnimatePresence mode="wait">
          {activeDetail && (
            <DetailPanel
              key={activeDetail}
              detail={activeDetail}
              onClose={() => setActiveDetail(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default AIHub;
