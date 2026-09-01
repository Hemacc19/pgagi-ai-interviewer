from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional

from app.services.interview_service import generate_interview_questions


router = APIRouter(
    prefix="/api/interview",
    tags=["Interview"]
)


class InterviewRequest(BaseModel):
    role: str
    experience_level: str = "Fresher"
    skills: List[str] = Field(default_factory=list)
    technologies: List[str] = Field(default_factory=list)
    topics: List[str] = Field(default_factory=list)
    number_of_questions: int = Field(default=10, ge=1, le=50)


@router.post("/generate")
async def generate_questions(request: InterviewRequest):

    if not request.role.strip():
        raise HTTPException(
            status_code=400,
            detail="Role is required."
        )

    try:

        result = generate_interview_questions(
            role=request.role,
            experience_level=request.experience_level,
            skills=request.skills,
            technologies=request.technologies,
            topics=request.topics,
            number_of_questions=request.number_of_questions,
        )

        return {
            "message": "Interview questions generated successfully",
            "data": result
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate interview questions: {str(e)}"
        )