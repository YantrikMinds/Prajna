from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel

class ContestBase(BaseModel):
    title: str
    description: str
    start_time: datetime
    end_time: datetime
    duration_minutes: int
    problem_ids: str  # Comma-separated: "1,2,3"

class ContestCreate(ContestBase):
    pass

class ContestResponse(ContestBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class ContestParticipationCreate(BaseModel):
    contest_id: int

class ContestParticipationResponse(BaseModel):
    id: int
    contest_id: int
    user_id: int
    score: int
    finished_time: Optional[datetime] = None
    details: str

    class Config:
        from_attributes = True

class LeaderboardEntry(BaseModel):
    rank: int
    user_id: int
    full_name: str
    score: int
    finished_time: Optional[datetime] = None
