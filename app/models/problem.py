from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from sqlalchemy.sql import func
from app.core.database import Base

class Problem(Base):
    __tablename__ = "problems"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    difficulty = Column(String, nullable=False)  # Easy, Medium, Hard
    tags = Column(String, default="")  # Comma-separated: "Array, Hash Table"
    
    # Store test cases as JSON: [{"input": "2 3", "output": "5"}, ...]
    test_cases = Column(Text, nullable=False)
    
    time_limit = Column(Float, default=1.0)  # in seconds
    memory_limit = Column(Integer, default=128)  # in MB
    company_tags = Column(String, default="")  # Comma-separated: "Google, Amazon"
    
    # Store language templates: {"python": "def add(a, b):\n    pass", ...}
    starter_code = Column(Text, nullable=True)
    
    # Editorial content
    editorial = Column(Text, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
