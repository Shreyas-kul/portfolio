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
Objective: AI/ML Engineer with a strong foundation in Python, Transformers, and LLM fine-tuning, combined with experience in distributed cloud automation using Azure Logic Apps, Service Bus, and Power Automate. Adept at designing scalable AI architectures with RAG, LangChain, and Vector Databases. Passionate about building next-gen Agentic AI systems and enterprise automation pipelines. Achieved 95% AI automation efficiency across projects. 
Education: Bachelor of Engineering in AI/ML from B.M.S College of Engineering, Dec 2021 to June 2025. 
Experience 1: Software Development Engineer at sa.global Labs from Dec 2025 to Present. Built cutting-edge AI systems, Agent-to-Agent (A2A) communication systems, MCP-based architectures, and AI backends using MongoDB and Neo4j. 
Experience 2: Azure AI Intern at sa.global from Mar 2025 to Sept 2025. Built an Agentic AI system for employee feedback using Microsoft Copilot Studio, Azure Logic Apps, increasing automation by 92%. 
Projects: Employee Feedback Assistant (May 2025 to Jul 2025), Doc-U-Chat using LangChain RAG with Qdrant Vector DB (May 2024 to Jun 2024), Sales & Marketing Automation with predictive ML pipelines using Logic Apps (Aug 2025 to Oct 2025). 
Skills: Python, C, SQL, Azure Platform, AWS, Vector DBs, Qdrant, PostgreSQL, MongoDB, Neo4j, Azure AI Studio, OpenAI, PyTorch, Transformers, LangChain, AutoGen v2. 
Certifications: Azure AI Engineer Associate, Azure Fundamentals AZ-900, Generative AI with LLMs, IBM Data Science Professional.
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
