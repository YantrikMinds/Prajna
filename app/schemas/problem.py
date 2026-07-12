from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel

class ProblemBase(BaseModel):
    title: str
    description: str
    difficulty: str  # Easy, Medium, Hard
    tags: str  # Comma-separated
    time_limit: float = 1.0
    memory_limit: int = 128
    company_tags: str = ""

class ProblemCreate(ProblemBase):
    test_cases: str  # JSON String: [{"input": "...", "output": "..."}]
    starter_code: Optional[str] = "{}"  # JSON String: {"python": "...", "javascript": "..."}
    editorial: Optional[str] = ""

class ProblemResponse(ProblemBase):
    id: int
    test_cases: str
    starter_code: Optional[str]
    editorial: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

class ProblemBrief(BaseModel):
    id: int
    title: str
    difficulty: str
    tags: str
    company_tags: str

    class Config:
        from_attributes = True
