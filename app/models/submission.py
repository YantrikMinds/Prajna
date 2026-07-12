from sqlalchemy import Column, Integer, String, Float, DateTime, Text, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Submission(Base):
    __tablename__ = "submissions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    problem_id = Column(Integer, ForeignKey("problems.id"), nullable=False)
    code = Column(Text, nullable=False)
    language = Column(String, nullable=False)
    status = Column(String, nullable=False)  # Accepted, Wrong Answer, Time Limit Exceeded, Runtime Error, Compilation Error, Running
    
    execution_time = Column(Float, default=0.0)  # in seconds
    memory = Column(Integer, default=0)  # in KB or MB
    error_message = Column(Text, nullable=True)
    
    passed_test_cases = Column(Integer, default=0)
    total_test_cases = Column(Integer, default=0)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User")
    problem = relationship("Problem")
