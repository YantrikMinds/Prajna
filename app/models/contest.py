from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Contest(Base):
    __tablename__ = "contests"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    duration_minutes = Column(Integer, nullable=False)
    
    # Store list of problem IDs as comma-separated string, e.g. "1,2,3,4"
    problem_ids = Column(String, nullable=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class ContestParticipation(Base):
    __tablename__ = "contest_participations"

    id = Column(Integer, primary_key=True, index=True)
    contest_id = Column(Integer, ForeignKey("contests.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    score = Column(Integer, default=0)
    finished_time = Column(DateTime, nullable=True)
    
    # Store details like individual problem solve status or times
    # e.g., JSON string: {"1": {"solved": true, "time": 12, "attempts": 2}}
    details = Column(Text, default="{}")

    # Relationships
    contest = relationship("Contest")
    user = relationship("User")
