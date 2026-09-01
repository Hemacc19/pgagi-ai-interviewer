from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base
from app import models

from app.api.resume import router as resume_router
from app.api.interview import router as interview_router
from app.api.result import router as result_router


# ============================================================
# CREATE DATABASE TABLES
# ============================================================

Base.metadata.create_all(bind=engine)


# ============================================================
# FASTAPI APPLICATION
# ============================================================

app = FastAPI(
    title="PGAGI AI Interviewer",
    description="AI-powered role-based candidate screening system",
    version="1.0.0"
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# REGISTER API ROUTERS
# ============================================================

app.include_router(resume_router)
app.include_router(interview_router)
app.include_router(result_router)


# ============================================================
# ROOT ENDPOINT
# ============================================================

@app.get("/")
def root():
    return {
        "message": "PGAGI AI Interviewer API is running"
    }