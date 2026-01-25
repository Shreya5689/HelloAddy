from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

class UserSheet(Base):
    __tablename__ = "user_sheets"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationship to items
    problems = relationship("UserProblemSheet", back_populates="sheet")

class UserProblemSheet(Base):
    __tablename__ = "user_problem_sheets"

    id = Column(Integer, primary_key=True)
    sheet_id = Column(Integer, ForeignKey("user_sheets.id"), nullable=False) # Link to the sheet
    topic = Column(String, nullable=False)
    title = Column(String, nullable=False)
    difficulty = Column(String, nullable=True)
    url = Column(String, nullable=True)
    platform = Column(String, nullable=False) 
    paid_only = Column(Boolean, default=False)
    
    sheet = relationship("UserSheet", back_populates="problems")

