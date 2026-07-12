from datetime import datetime, date
from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field

class UserBase(BaseModel):
    email: EmailStr
    full_name: str

class UserCreate(UserBase):
    password: str = Field(..., min_length=6)

class UserResponse(UserBase):
    id: int
    role: str
    xp: int
    coins: int
    streak: int
    last_active_date: Optional[date] = None
    badges: str  # We'll parse this as a JSON string in frontend, or custom validator
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
