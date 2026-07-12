from typing import List, Optional, Dict
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from app.api.deps import get_current_user
from app.models.user import User
from app.services.gemini import call_gemini

router = APIRouter()

# AI Request Models
class AIReviewRequest(BaseModel):
    code: str
    language: str
    problem_title: str
    problem_description: str

class AIExplainRequest(BaseModel):
    code: str
    language: str

class AIOptimizeRequest(BaseModel):
    code: str
    language: str
    problem_description: Optional[str] = ""

class AIHintsRequest(BaseModel):
    problem_title: str
    problem_description: str
    code: Optional[str] = ""
    history_hints: Optional[List[str]] = []

class AIRoadmapRequest(BaseModel):
    target_role: str
    experience_level: str  # Beginner, Intermediate, Advanced
    current_knowledge: Optional[str] = ""

class AIChatMessage(BaseModel):
    role: str  # user, assistant
    content: str

class AIInterviewRequest(BaseModel):
    role: str
    topic: str
    chat_history: List[AIChatMessage]

class AIResumeRequest(BaseModel):
    resume_text: str
    target_job_description: str

class AIChatRequest(BaseModel):
    code: str
    language: str
    problem_title: str
    problem_description: str
    chat_history: List[AIChatMessage]
    latest_message: str

# Endpoints
@router.post("/review")
async def ai_review_code(payload: AIReviewRequest, current_user: User = Depends(get_current_user)):
    prompt = f"""
    Problem Title: {payload.problem_title}
    Problem Description: {payload.problem_description}
    Language: {payload.language}
    User Code:
    ```
    {payload.code}
    ```
    
    Please provide a code review. Analyze:
    1. Time & Space Complexity (e.g., O(N), O(1)).
    2. Correctness & Potential Edge Cases.
    3. Code Quality, Style & Readability.
    4. Provide constructive feedback on how to improve.
    Format your response in neat, professional Markdown.
    """
    sys_instruction = "You are an expert software engineer and technical reviewer. Provide constructive, detailed code reviews."
    review = await call_gemini(prompt, sys_instruction)
    return {"review": review}

@router.post("/explain")
async def ai_explain_code(payload: AIExplainRequest, current_user: User = Depends(get_current_user)):
    prompt = f"""
    Language: {payload.language}
    Code:
    ```
    {payload.code}
    ```
    
    Please explain this code line-by-line or block-by-block. Break it down in a simple, easy-to-understand way.
    Format your response in clean Markdown.
    """
    sys_instruction = "You are a friendly computer science teacher. Explain code step-by-step so that even a beginner can follow along."
    explanation = await call_gemini(prompt, sys_instruction)
    return {"explanation": explanation}

@router.post("/optimize")
async def ai_optimize_code(payload: AIOptimizeRequest, current_user: User = Depends(get_current_user)):
    prompt = f"""
    Language: {payload.language}
    Problem Context (if any): {payload.problem_description}
    Original Code:
    ```
    {payload.code}
    ```
    
    Optimize this code. Provide:
    1. The optimized code version.
    2. Explanation of optimizations made (e.g., better data structure, reduced time/space complexity).
    3. Comparison of time/space complexity between original and optimized versions.
    Format your response in clean Markdown.
    """
    sys_instruction = "You are a senior algorithms designer. Optimize code for peak performance, explaining the algorithmic improvements clearly."
    result = await call_gemini(prompt, sys_instruction)
    return {"optimized_code": result}

@router.post("/hints")
async def ai_generate_hints(payload: AIHintsRequest, current_user: User = Depends(get_current_user)):
    history_str = "\n".join([f"- Hint previously shown: {h}" for h in payload.history_hints]) if payload.history_hints else "None"
    prompt = f"""
    Problem Title: {payload.problem_title}
    Problem Description: {payload.problem_description}
    User's Current Code (if any):
    ```
    {payload.code}
    ```
    Hints already shown:
    {history_str}
    
    Provide the next helpful, progressive hint. Do NOT give the solution or complete code. 
    Point the user in the right direction (e.g., think about binary search, what data structure would be best, or what is the base case).
    Format the hint as a short, encouraging message in Markdown.
    """
    sys_instruction = "You are a DSA coach. Give progressive hints that help the user think and solve the problem themselves. Never give the code solution."
    hint = await call_gemini(prompt, sys_instruction)
    return {"hint": hint}

@router.post("/roadmap")
async def ai_generate_roadmap(payload: AIRoadmapRequest, current_user: User = Depends(get_current_user)):
    prompt = f"""
    Target Role: {payload.target_role}
    Experience Level: {payload.experience_level}
    Current Knowledge / Focus: {payload.current_knowledge}
    
    Create a highly structured, week-by-week learning roadmap to master DSA and full-stack development skills required for this role.
    For each week/milestone:
    1. Key topics to study.
    2. Hand-picked problem types (e.g., sliding window, dynamic programming).
    3. Practical project ideas.
    4. Recommended resources.
    Format your response in clean Markdown with progress check-boxes.
    """
    sys_instruction = "You are a technical career mentor. Design clear, actionable, structured learning roadmaps for aspiring software developers."
    roadmap = await call_gemini(prompt, sys_instruction)
    return {"roadmap": roadmap}

@router.post("/interview")
async def ai_interview_coach(payload: AIInterviewRequest, current_user: User = Depends(get_current_user)):
    history_str = ""
    for msg in payload.chat_history:
        speaker = "Candidate" if msg.role == "user" else "Interviewer"
        history_str += f"{speaker}: {msg.content}\n"

    prompt = f"""
    Target Role: {payload.role}
    Interview Topic: {payload.topic}
    
    Chat History:
    {history_str}
    
    You are the technical interviewer. 
    1. If the Chat History is empty, introduce yourself, ask the candidate if they're ready, and present the first technical or behavioral question appropriate for a {payload.role} on {payload.topic}.
    2. If the candidate just answered, evaluate their response briefly (internally, do not be overly critical yet), and ask a relevant follow-up question or the next technical question.
    3. If the candidate asks to end or wrap up, provide a detailed performance feedback summary including strengths, areas for improvement, and a mock score out of 10.
    
    Keep the interviewer persona active and write only the Interviewer's next dialog response.
    """
    sys_instruction = "You are a technical interviewer at a tier-1 tech company (like Google or Meta). Speak and act professional, supportive, but technical."
    response = await call_gemini(prompt, sys_instruction)
    return {"response": response}

@router.post("/resume")
async def ai_resume_feedback(payload: AIResumeRequest, current_user: User = Depends(get_current_user)):
    prompt = f"""
    Target Job Description:
    {payload.target_job_description}
    
    Candidate Resume Details:
    {payload.resume_text}
    
    Analyze the resume against the target job description and provide:
    1. Match score (percentage estimate).
    2. Keywords missing from the resume but present in the job description.
    3. Specific bullet points in the resume that can be quantified or rewritten for stronger impact.
    4. Overall formatting or structure suggestions.
    Format your response in clean, professional Markdown.
    """
    sys_instruction = "You are an expert technical recruiter and resume reviewer. Provide honest, highly constructive feedback to help candidates get interviews."
    feedback = await call_gemini(prompt, sys_instruction)
    return {"feedback": feedback}

@router.post("/playground/chat")
async def ai_playground_chat(payload: AIChatRequest, current_user: User = Depends(get_current_user)):
    history_str = ""
    for msg in payload.chat_history:
        speaker = "Candidate" if msg.role == "user" else "Interviewer"
        history_str += f"{speaker}: {msg.content}\n"

    prompt = f"""
    Problem Title: {payload.problem_title}
    Problem Description: {payload.problem_description}
    Code Language: {payload.language}
    
    User's Current Code:
    ```
    {payload.code}
    ```
    
    Conversation History:
    {history_str}
    
    Latest User Query: {payload.latest_message}
    
    Provide a supportive, technically accurate reply. Keep explanations simple, clear, and action-oriented. 
    Format your response in neat, professional Markdown.
    """
    sys_instruction = "You are an expert coding coach and mentor. Help the user debug, optimize, or understand their code in relation to the DSA problem."
    response = await call_gemini(prompt, sys_instruction)
    return {"response": response}
