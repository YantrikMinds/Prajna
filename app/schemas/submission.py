from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class SubmissionCreate(BaseModel):
    problem_id: int
    code: str
    language: str

class SubmissionRun(BaseModel):
    code: str
    language: str
    custom_input: str

class SubmissionResponse(BaseModel):
    id: int
    user_id: int
    problem_id: int
    code: str
    language: str
    status: str
    execution_time: float
    memory: int
    error_message: Optional[str] = None
    passed_test_cases: int
    total_test_cases: int
    created_at: datetime

    class Config:
        from_attributes = True

class RunResponse(BaseModel):
    status: str  # Accepted, Wrong Answer, Runtime Error, etc.
    stdout: Optional[str] = None
    stderr: Optional[str] = None
    execution_time: float
    memory: int
