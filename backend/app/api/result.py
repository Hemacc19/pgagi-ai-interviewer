
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional

from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Candidate, InterviewSession, InterviewQuestion
from app.services.interview_service import evaluate_answer


router = APIRouter(
    prefix="/api/result",
    tags=["Result"]
)


# ============================================================
# ANSWER MODEL
# ============================================================

class InterviewAnswer(BaseModel):
    question: str
    answer: str
    expected_answer: Optional[str] = None


# ============================================================
# INTERVIEW RESULT REQUEST
# ============================================================

class InterviewResultRequest(BaseModel):
    role: str
    experience_level: str = "Fresher"
    answers: List[InterviewAnswer]


# ============================================================
# SUBMIT INTERVIEW RESULT
# ============================================================

@router.post("/submit")
async def submit_result(
    request: InterviewResultRequest,
    db: Session = Depends(get_db)
):

    if not request.answers:
        raise HTTPException(
            status_code=400,
            detail="At least one interview answer is required."
        )

    try:

        # ----------------------------------------------------
        # Create Candidate
        # ----------------------------------------------------

        candidate = Candidate(
            resume_text="Resume not provided",
            skills="",
            technologies=""
        )

        db.add(candidate)
        db.commit()
        db.refresh(candidate)

        # ----------------------------------------------------
        # Create Interview Session
        # ----------------------------------------------------

        session = InterviewSession(
            candidate_id=candidate.id,
            role=request.role,
            status="completed"
        )

        db.add(session)
        db.commit()
        db.refresh(session)

        # ----------------------------------------------------
        # Evaluate and save answers
        # ----------------------------------------------------

        evaluations = []
        total_score = 0

        for index, answer in enumerate(
            request.answers,
            start=1
        ):

            evaluation = evaluate_answer(
                question=answer.question,
                answer=answer.answer,
                expected_answer=answer.expected_answer
            )

            score = float(evaluation["score"])

            total_score += score

            # Save question to database
            question_record = InterviewQuestion(
                session_id=session.id,
                question=answer.question,
                topic=None,
                difficulty=None,
                retrieved_context=answer.expected_answer,
                source_chunks=None,
                answer=answer.answer,
                score=int(score),
                feedback=evaluation["feedback"]
            )

            db.add(question_record)

            evaluations.append({
                "question_number": index,
                "question": answer.question,
                "answer": answer.answer,
                "score": score,
                "feedback": evaluation["feedback"],
                "strengths": evaluation["strengths"],
                "improvements": evaluation["improvements"]
            })

        # Save all questions
        db.commit()

        # ----------------------------------------------------
        # Calculate result
        # ----------------------------------------------------

        total_questions = len(request.answers)

        average_score = total_score / total_questions

        percentage = (average_score / 10) * 100

        if percentage >= 80:
            result_status = "Excellent"

        elif percentage >= 60:
            result_status = "Good"

        elif percentage >= 40:
            result_status = "Needs Improvement"

        else:
            result_status = "Poor"

        # ----------------------------------------------------
        # Return response
        # ----------------------------------------------------

        return {
            "message": "Interview evaluated successfully",

            "data": {
                "candidate_id": candidate.id,
                "session_id": session.id,

                "role": request.role,
                "experience_level": request.experience_level,

                "total_questions": total_questions,
                "total_score": round(total_score, 2),
                "average_score": round(average_score, 2),
                "percentage": round(percentage, 2),

                "result": result_status,

                "evaluations": evaluations
            }
        }

    except Exception as e:

        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=f"Failed to evaluate interview: {str(e)}"
        )

    # ============================================================
# GET INTERVIEW HISTORY
# ============================================================

@router.get("/history")
def get_interview_history(
    db: Session = Depends(get_db)
):

    sessions = (
        db.query(InterviewSession)
        .order_by(InterviewSession.created_at.desc())
        .all()
    )

    history = []

    for session in sessions:

        questions = (
            db.query(InterviewQuestion)
            .filter(
                InterviewQuestion.session_id == session.id
            )
            .all()
        )

        total_questions = len(questions)

        total_score = sum(
            q.score or 0
            for q in questions
        )

        average_score = (
            total_score / total_questions
            if total_questions > 0
            else 0
        )

        percentage = (
            (average_score / 10) * 100
            if total_questions > 0
            else 0
        )

        history.append({
            "candidate_id": session.candidate_id,
            "session_id": session.id,
            "role": session.role,
            "status": session.status,
            "total_questions": total_questions,
            "total_score": total_score,
            "average_score": round(average_score, 2),
            "percentage": round(percentage, 2),
            "created_at": session.created_at
        })

    return {
        "message": "Interview history retrieved successfully",
        "data": history
    }

# ============================================================
# GET DETAILED INTERVIEW RESULT
# ============================================================

@router.get("/{session_id}")
def get_interview_result(
    session_id: int,
    db: Session = Depends(get_db)
):

    # Find interview session
    session = (
        db.query(InterviewSession)
        .filter(InterviewSession.id == session_id)
        .first()
    )

    if not session:
        raise HTTPException(
            status_code=404,
            detail="Interview session not found."
        )

    # Get questions for this session
    questions = (
        db.query(InterviewQuestion)
        .filter(
            InterviewQuestion.session_id == session_id
        )
        .order_by(InterviewQuestion.id)
        .all()
    )

    if not questions:
        raise HTTPException(
            status_code=404,
            detail="No questions found for this interview."
        )

    total_questions = len(questions)

    total_score = sum(
        question.score or 0
        for question in questions
    )

    average_score = total_score / total_questions

    percentage = (average_score / 10) * 100

    if percentage >= 80:
        result_status = "Excellent"
    elif percentage >= 60:
        result_status = "Good"
    elif percentage >= 40:
        result_status = "Needs Improvement"
    else:
        result_status = "Poor"

    evaluations = []

    for index, question in enumerate(
        questions,
        start=1
    ):

        evaluations.append({
            "question_number": index,
            "question": question.question,
            "answer": question.answer,
            "score": question.score or 0,
            "feedback": question.feedback,
            "difficulty": question.difficulty,
            "topic": question.topic
        })

    return {
        "message": "Interview result retrieved successfully",

        "data": {
            "session_id": session.id,
            "candidate_id": session.candidate_id,
            "role": session.role,
            "status": session.status,

            "total_questions": total_questions,
            "total_score": total_score,
            "average_score": round(average_score, 2),
            "percentage": round(percentage, 2),

            "result": result_status,

            "evaluations": evaluations
        }
    }

# ============================================================
# GET CANDIDATE DETAILS
# ============================================================

@router.get("/{candidate_id}")
def get_candidate(
    candidate_id: int,
    db: Session = Depends(get_db)
):

    candidate = (
        db.query(Candidate)
        .filter(Candidate.id == candidate_id)
        .first()
    )

    if not candidate:
        raise HTTPException(
            status_code=404,
            detail="Candidate not found."
        )

    return {
        "message": "Candidate retrieved successfully",
        "data": {
            "candidate_id": candidate.id,
            "resume_text": candidate.resume_text,
            "skills": candidate.skills,
            "technologies": candidate.technologies,
            "created_at": candidate.created_at
        }
    }
