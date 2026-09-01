

from pydantic import BaseModel, EmailStr


# ============================================================
# REGISTER
# ============================================================

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str


# ============================================================
# LOGIN
# ============================================================

class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# ============================================================
# AUTH RESPONSE
# ============================================================

class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr

    class Config:
        from_attributes = True


class AuthResponse(BaseModel):
    message: str
    user: UserResponse

