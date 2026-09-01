
from typing import List, Dict, Any, Optional
import os
import json

from dotenv import load_dotenv
from langchain_groq import ChatGroq

from app.services.rag_service import retrieve_context


# ============================================================
# LOAD ENVIRONMENT VARIABLES
# ============================================================

load_dotenv()


# ============================================================
# GROQ LLM
# ============================================================

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    raise RuntimeError(
        "GROQ_API_KEY is not configured. "
        "Please add it to the backend .env file."
    )


llm = ChatGroq(
    api_key=GROQ_API_KEY,
    model="openai/gpt-oss-20b",
    temperature=0.3,
)


# ============================================================
# GENERATE INTERVIEW QUESTIONS
# ============================================================

def generate_interview_questions(
    role: str,
    experience_level: str = "Fresher",
    skills: Optional[List[str]] = None,
    technologies: Optional[List[str]] = None,
    topics: Optional[List[str]] = None,
    number_of_questions: int = 10,
) -> Dict[str, Any]:

    skills = skills or []
    technologies = technologies or []
    topics = topics or []

    number_of_questions = max(1, min(number_of_questions, 50))

    # --------------------------------------------------------
    # RAG RETRIEVAL
    # --------------------------------------------------------

    rag_data = retrieve_context(
        role=role,
        experience_level=experience_level,
        skills=skills,
        technologies=technologies,
        topics=topics,
        top_k=10,
        max_chars=16000,
    )

    context = rag_data["context"]

    if not context:
        raise RuntimeError(
            "No relevant knowledge was found in the RAG knowledge base."
        )

    # --------------------------------------------------------
    # QUESTION GENERATION PROMPT
    # --------------------------------------------------------

    prompt = f"""
You are an expert technical interviewer.

Generate {number_of_questions} interview questions.

Role:
{role}

Experience Level:
{experience_level}

Skills:
{", ".join(skills) if skills else "Not specified"}

Technologies:
{", ".join(technologies) if technologies else "Not specified"}

Topics:
{", ".join(topics) if topics else "Not specified"}

Use the retrieved knowledge as the primary source.

Rules:
1. Generate actual interview questions.
2. Do not copy raw PDF text.
3. Do not mention retrieved documents or page numbers.
4. Questions must be clear and professional.
5. Match the candidate's experience level.
6. Cover different concepts.
7. Use the candidate's skills and technologies.
8. Return ONLY valid JSON.
9. Return exactly a "questions" array.
10. Each question must contain:
   - question
   - difficulty
   - category

Example:

{{
    "questions": [
        {{
            "question": "What is supervised learning?",
            "difficulty": "Easy",
            "category": "Machine Learning"
        }}
    ]
}}

Retrieved Knowledge:
--------------------
{context}
--------------------
"""

    response = llm.invoke(prompt)

    response_text = response.content.strip()

    # Remove markdown fences
    if response_text.startswith("```json"):
        response_text = response_text[7:]
    elif response_text.startswith("```"):
        response_text = response_text[3:]

    if response_text.endswith("```"):
        response_text = response_text[:-3]

    response_text = response_text.strip()

    try:
        generated_data = json.loads(response_text)

    except json.JSONDecodeError as e:
        raise RuntimeError(
            f"Groq returned invalid JSON: {e}\n"
            f"Response: {response_text}"
        )

    generated_questions = generated_data.get("questions", [])

    generated_questions = generated_questions[:number_of_questions]

    return {
        "role": role,
        "experience_level": experience_level,
        "questions": generated_questions,
        "rag_query": rag_data["query"],
        "context": rag_data["context"],
    }


# ============================================================
# EVALUATE ONE INTERVIEW ANSWER
# ============================================================

def evaluate_answer(
    question: str,
    answer: str,
    expected_answer: Optional[str] = None,
) -> Dict[str, Any]:

    if not question.strip():
        raise ValueError("Question cannot be empty.")

    if not answer.strip():
        return {
            "score": 0,
            "feedback": "No answer was provided.",
            "strengths": [],
            "improvements": ["Provide an answer to the question."],
        }

    expected = expected_answer or "No predefined answer is available."

    # --------------------------------------------------------
    # EVALUATION PROMPT
    # --------------------------------------------------------

    prompt = f"""
You are an expert technical interviewer evaluating a candidate.

Question:
{question}

Candidate Answer:
{answer}

Expected Answer / Key Points:
{expected}

Evaluate the candidate's answer.

Scoring:
- 0-2: Incorrect or irrelevant
- 3-4: Very weak understanding
- 5-6: Basic understanding
- 7-8: Good understanding
- 9-10: Excellent understanding

Rules:
1. Be fair to a fresher-level candidate.
2. Focus on technical correctness.
3. Do not require the candidate to use exactly the same wording.
4. Give useful feedback.
5. Return ONLY valid JSON.

Required JSON format:

{{
    "score": 0,
    "feedback": "Short explanation of the evaluation.",
    "strengths": [
        "Point the candidate explained correctly."
    ],
    "improvements": [
        "Point the candidate should improve."
    ]
}}
"""

    response = llm.invoke(prompt)

    response_text = response.content.strip()

    # Remove markdown code fences
    if response_text.startswith("```json"):
        response_text = response_text[7:]
    elif response_text.startswith("```"):
        response_text = response_text[3:]

    if response_text.endswith("```"):
        response_text = response_text[:-3]

    response_text = response_text.strip()

    try:
        evaluation = json.loads(response_text)

    except json.JSONDecodeError as e:
        raise RuntimeError(
            f"Groq returned invalid evaluation JSON: {e}\n"
            f"Response: {response_text}"
        )

    # --------------------------------------------------------
    # Validate score
    # --------------------------------------------------------

    try:
        score = float(evaluation.get("score", 0))
    except (TypeError, ValueError):
        score = 0

    score = max(0, min(score, 10))

    return {
        "score": score,
        "feedback": evaluation.get(
            "feedback",
            "No feedback provided."
        ),
        "strengths": evaluation.get(
            "strengths",
            []
        ),
        "improvements": evaluation.get(
            "improvements",
            []
        ),
    }

