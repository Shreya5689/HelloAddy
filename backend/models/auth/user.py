from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

class Users(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)

    # Optional: relationship back to profile
    # profile = relationship("UserProfile", back_populates="user", uselist=False)


class UserProfile(Base):
    __tablename__ = "user_profile"

    username = Column(String, ForeignKey("users.username"), primary_key=True)
    # email = Column(String, ForeignKey("users.email"), unique=True, nullable=False)
    ranking = Column(String)
    bio = Column(String)
    # profile_picture = Column(String)

    # Optional: setup relationship logic
    # user = relationship("Users", back_populates="profile")


class UserOTP(Base):
    __tablename__ = "user_otp"
    username = Column(String, ForeignKey("users.username"), primary_key=True)
    otp = Column(String)
    expires_at = Column(DateTime)   
    created_at = Column(DateTime, default=datetime.utcnow)

