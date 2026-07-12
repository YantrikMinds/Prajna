from sqlalchemy import Column, Integer, String, DateTime, Date
from sqlalchemy.sql import func
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(String, default="user")  # user, admin
    
    # Gamification
    xp = Column(Integer, default=0)
    coins = Column(Integer, default=0)
    streak = Column(Integer, default=0)
    last_active_date = Column(Date, nullable=True)
    badges = Column(String, default="[]")  # Store as JSON string, e.g., ["Beginner", "First Submission"]
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
