import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from groq import Groq

# Load environment variables
load_dotenv()

app = FastAPI()

# Allow frontend to access the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    query: str

# Resume Context - Pass the whole resume to Groq. Fits easily in LLaMa 3 8k context window.
RESUME_CONTEXT = """
Name: Shreyas Kulkarni. 
Role: AI/ML Engineer. 
Email: shrkul@gmail.com. 
Phone: +91 9380489018. 
Objective: AI/ML Engineer specializing in scalable LLM-based systems, agentic architectures, and distributed systems. Experienced in building production-grade AI platforms, retrieval systems, and intelligent automation solutions for enterprise applications.
Education: B.E. in AI/ML from B.M.S College of Engineering, Dec 2021 to June 2025. 
Experience: Software Engineer — Azure AI Intern at sa.global / sa.global Labs from Mar 2025 to Present. Contributed to enterprise AI products (Evergreen, Empower, Elevate) built on Azure and Dynamics 365. Architected agentic AI systems and distributed LLM pipelines. Built backend systems using Python, async microservices, and event-driven architectures. Developed hybrid retrieval systems using Neo4j and vector databases. Improved workflow efficiency by 92% and analytical accuracy by 88%.
Projects: sa.global chAIn (March 2026 to Present) - Production-grade AI platform using LLMs, RAG, and multi-agent systems for enterprise knowledge discovery. Feedback Neural Network (May 2025 to Jul 2025) - Multi-agent AI system for end-to-end employee feedback automation, reduced manual effort by 95%. D-BUG (Jan 2026 to March 2026) - Autonomous code reliability agent using LLM-based reasoning and adversarial testing. Doc-U-Chat (May 2024 to Jun 2024) - Scalable RAG chatbot using LangChain, Llama 3 70B, and Qdrant with 98% retrieval accuracy. Sales & Marketing Automation (Aug 2025 to Oct 2025) - Predictive ML pipelines with 90% accurate churn predictions. Employee Feedback Assistant (May 2025 to Jul 2025) - Automated HR workflows using Copilot Studio, 95% reduction in manual workload.
Skills: Languages: Python, SQL, C#, C++, Java. AI/ML: LLMs, Agentic AI, RAG, Transformers, LangChain, Fine-tuning, Embeddings. Systems: Distributed Systems, Microservices, REST APIs, Async Programming, Event-Driven Architecture. Data: MongoDB, Neo4j, PostgreSQL, FAISS, Qdrant. Cloud: Azure, AWS, GCP, Kubernetes, Docker, CI/CD. DevOps: Azure DevOps, GitHub Actions. Tools: Claude Code, OpenAI Codex, Cursor, LangGraph, AutoGen V2, CrewAI, Langfuse.
Certifications: Microsoft Certified Azure AI Engineer Associate, Microsoft Certified Azure Fundamentals (AZ-900), Generative AI with LLMs from DeepLearning.AI, IBM Data Science Professional Certificate.
"""

SYSTEM_PROMPT = f"""
You are Shreyas Kulkarni's AI Assistant. You are a highly intelligent, professional Agentic AI.
Based on the following context from Shreyas's resume, answer the user's question.

CRITICAL INSTRUCTION: If the context doesn't contain the answer, or the question is completely unrelated to Shreyas, you MUST prefix your answer with EXACTLY: "I couldn't find this in Shreyas's portfolio domain, but here is your answer: " and then answer the general question to the best of your ability using your own knowledge. Do not apologize, just state the prefix and answer it.

Context: 
{RESUME_CONTEXT}
"""

@app.get("/")
def read_root():
    return {"status": "Groq Lightweight Backend is running"}

@app.post("/chat")
def chat(request: ChatRequest):
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="GROQ_API_KEY environment variable is not set in backend/.env")
    
    try:
        # Direct generation via the official Groq SDK avoiding Langchain version conflicts
        client = Groq(api_key=api_key)
        
        completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": SYSTEM_PROMPT
                },
                {
                    "role": "user",
                    "content": request.query
                }
            ],
            model="llama-3.3-70b-versatile",
            temperature=0
        )
        
        answer = completion.choices[0].message.content
        
        # Determine metadata label based on if fallback flag was tripped
        is_fallback = "I couldn't find this" in answer
        
        return {
            "answer": answer,
            "source": "External API" if is_fallback else "Local Vector DB"
        }
    except Exception as e:
        print(f"Error during Groq generation: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
