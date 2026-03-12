import { pipeline, env, cos_sim } from '@xenova/transformers';

env.allowLocalModels = false;
env.useBrowserCache = true;

class EmbeddingPipeline {
    static task = 'feature-extraction';
    static model = 'Xenova/all-MiniLM-L6-v2';
    static instance = null;

    static async getInstance(progress_callback = null) {
        if (this.instance === null) {
            this.instance = await pipeline(this.task, this.model, { progress_callback });
        }
        return this.instance;
    }
}

class QAPipeline {
    static task = 'question-answering';
    static model = 'Xenova/distilbert-base-uncased-distilled-squad';
    static instance = null;

    static async getInstance(progress_callback = null) {
        if (this.instance === null) {
            this.instance = await pipeline(this.task, this.model, { progress_callback });
        }
        return this.instance;
    }
}

const RESUME_CONTEXT = `
Name: Shreyas Kulkarni. 
Role: AI/ML Engineer. 
Email: shrkul@gmail.com. 
Phone: +91 9380489018. 
Objective: AI/ML Engineer with a strong foundation in Python, Transformers, and LLM fine-tuning, combined with experience in distributed cloud automation using Azure Logic Apps, Service Bus, and Power Automate. Adept at designing scalable AI architectures with RAG, LangChain, and Vector Databases. Passionate about building next-gen Agentic AI systems and enterprise automation pipelines. Achieved 95% AI automation efficiency across projects. 
Education: Bachelor of Engineering in AI/ML from B.M.S College of Engineering, Dec 2021 to June 2025. 
Experience 1: Software Development Engineer at sa.global Labs from Dec 2025 to Present. Built cutting-edge AI systems, Agent-to-Agent (A2A) communication systems, MCP-based architectures, and AI backends using MongoDB and Neo4j. 
Experience 2: Azure AI Intern at sa.global from Mar 2025 to Sept 2025. Built an Agentic AI system for employee feedback using Microsoft Copilot Studio, Azure Logic Apps, increasing automation by 92%. 
Projects: Employee Feedback Assistant (May 2025 to Jul 2025), Doc-U-Chat using LangChain RAG with Qdrant Vector DB (May 2024 to Jun 2024), Sales & Marketing Automation with predictive ML pipelines using Logic Apps (Aug 2025 to Oct 2025). 
Skills: Python, C, SQL, Azure Platform, AWS, Vector DBs, Qdrant, PostgreSQL, MongoDB, Neo4j, Azure AI Studio, OpenAI, PyTorch, Transformers, LangChain, AutoGen v2. 
Certifications: Azure AI Engineer Associate, Azure Fundamentals AZ-900, Generative AI with LLMs, IBM Data Science Professional.
`;

const CHUNKS = RESUME_CONTEXT.split('\n').filter(line => line.trim().length > 0);
let vectorDB = [];

async function initRAG() {
    let extract = await EmbeddingPipeline.getInstance(x => {
        self.postMessage({ status: 'progress', ...x, pipeline: 'Embedding Model' });
    });

    await QAPipeline.getInstance(x => {
        self.postMessage({ status: 'progress', ...x, pipeline: 'QA Model' });
    });

    // Populate in-memory Vector DB
    for (const chunk of CHUNKS) {
        let output = await extract(chunk, { pooling: 'mean', normalize: true });
        vectorDB.push({ text: chunk, embedding: output.data });
    }

    self.postMessage({ status: 'ready' });
}

// Preload the models and build the Vector DB immediately when worker starts
initRAG();

self.addEventListener('message', async (event) => {
    try {
        let extract = await EmbeddingPipeline.getInstance();
        let qa = await QAPipeline.getInstance();

        // 1. Embed the query
        let queryEmbedding = await extract(event.data.question, { pooling: 'mean', normalize: true });

        // 2. Vector Search (Semantic Similarity)
        let bestScore = -1;
        let bestChunk = "";

        for (const item of vectorDB) {
            let score = cos_sim(queryEmbedding.data, item.embedding);
            if (score > bestScore) {
                bestScore = score;
                bestChunk = item.text;
            }
        }

        // 3. Fallback Check (Out of Domain)
        if (bestScore < 0.3) {
            // Using correct Pollinations URL without /prompt/ to avoid deprecation warning
            const fallbackResponse = await fetch('https://text.pollinations.ai/' + encodeURIComponent(event.data.question + ' (answer briefly in 1-2 sentences)'));
            const fallbackText = await fallbackResponse.text();

            self.postMessage({
                status: 'complete',
                answer: fallbackText,
                score: 0.99,
                question: event.data.question,
                source: 'External API'
            });
            return;
        }

        // 4. RAG Generation (Pass best context to Transformer QA model)
        let output = await qa(event.data.question, bestChunk);

        let answer = output.answer;

        // If the QA model fails to extract a clear string, fallback to outputting the entire retrieved semantic chunk
        if (!answer || output.score < 0.05) {
            answer = bestChunk;
        }

        self.postMessage({
            status: 'complete',
            answer: answer,
            score: bestScore,
            question: event.data.question,
            source: 'Local Vector DB'
        });
    } catch (e) {
        self.postMessage({ status: 'error', error: e.message });
    }
});
