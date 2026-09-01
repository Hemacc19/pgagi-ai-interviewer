
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database import Base


# ============================================================
# USER
# ============================================================

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(
        String(100),
        nullable=False
    )

    email = Column(
        String(150),
        unique=True,
        index=True,
        nullable=False
    )

    password = Column(
        String(255),
        nullable=False
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    candidates = relationship(
        "Candidate",
        back_populates="user"
    )


# ============================================================
# CANDIDATE
# ============================================================

class Candidate(Base):
    __tablename__ = "candidates"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=True
    )

    resume_text = Column(
        Text,
        nullable=False
    )

    skills = Column(
        Text,
        nullable=True
    )

    technologies = Column(
        Text,
        nullable=True
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    user = relationship(
        "User",
        back_populates="candidates"
    )

    sessions = relationship(
        "InterviewSession",
        back_populates="candidate"
    )


# ============================================================
# INTERVIEW SESSION
# ============================================================

class InterviewSession(Base):
    __tablename__ = "interview_sessions"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    candidate_id = Column(
        Integer,
        ForeignKey("candidates.id")
    )

    role = Column(
        String(100),
        nullable=False
    )

    status = Column(
        String(50),
        default="active"
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    candidate = relationship(
        "Candidate",
        back_populates="sessions"
    )

    questions = relationship(
        "InterviewQuestion",
        back_populates="session"
    )


# ============================================================
# INTERVIEW QUESTION
# ============================================================

class InterviewQuestion(Base):
    __tablename__ = "interview_questions"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    session_id = Column(
        Integer,
        ForeignKey("interview_sessions.id")
    )

    question = Column(
        Text,
        nullable=False
    )

    topic = Column(
        String(200),
        nullable=True
    )

    difficulty = Column(
        String(50),
        nullable=True
    )

    retrieved_context = Column(
        Text,
        nullable=True
    )

    source_chunks = Column(
        Text,
        nullable=True
    )

    answer = Column(
        Text,
        nullable=True
    )

    score = Column(
        Integer,
        nullable=True
    )

    feedback = Column(
        Text,
        nullable=True
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    session = relationship(
        "InterviewSession",
        back_populates="questions"
    )

