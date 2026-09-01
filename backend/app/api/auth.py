
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User
from app.schemas import (
    RegisterRequest,
    LoginRequest,
    AuthResponse
)


router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)


# ============================================================
# REGISTER
# ============================================================

@router.post("/register", response_model=AuthResponse)
def register(
    data: RegisterRequest,
    db: Session = Depends(get_db)
):

    existing_user = (
        db.query(User)
        .filter(User.email == data.email)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered."
        )

    user = User(
        name=data.name,
        email=data.email,
        password=data.password
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return {
        "message": "Registration successful.",
        "user": user
    }


# ============================================================
# LOGIN
# ============================================================

@router.post("/login", response_model=AuthResponse)
def login(
    data: LoginRequest,
    db: Session = Depends(get_db)
):

    user = (
        db.query(User)
        .filter(User.email == data.email)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password."
        )

    if user.password != data.password:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password."
        )

    return {
        "message": "Login successful.",
        "user": user
    }

