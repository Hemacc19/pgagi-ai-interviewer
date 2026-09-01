from fastapi import APIRouter, UploadFile, File, HTTPException
from pathlib import Path
import shutil
import uuid

from app.utils.pdf_parser import extract_text_from_pdf
from app.services.resume_service import analyze_resume

router = APIRouter(
    prefix="/api/resume",
    tags=["Resume"]
)

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


@router.post("/upload")
async def upload_resume(file: UploadFile = File(...)):

    # Check file type
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are supported."
        )

    # Create a unique filename
    file_id = str(uuid.uuid4())
    file_path = UPLOAD_DIR / f"{file_id}.pdf"

    # Save uploaded file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Extract text
    resume_text = extract_text_from_pdf(str(file_path))

    if not resume_text:
        raise HTTPException(
            status_code=400,
            detail="Could not extract text from the resume."
        )
    analysis = analyze_resume(resume_text)

    return {
        "message": "Resume uploaded successfully",
        "filename": file.filename,
        "resume_text": resume_text,
        "skills": analysis["skills"],
        "technologies": analysis["technologies"]
    }