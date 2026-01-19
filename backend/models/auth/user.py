from database import get_db
from sqlalchemy import Column, Integer, String
from database import Base
from sqlalchemy.orm import relationship

class Users(Base):
    __tablename__="users"

    id=Column(Integer, primary_key=True, index=True)
    username=Column(String, unique=True, index=True)
    hashed_password = Column(String)
    ranking = Column(String)
    email = Column(String)

class UserProfile(Base):
    __tablename__="user_profile"
    id=Column(Integer, primary_key=True, index=True)
    user_id=Column(Integer)
    profile_picture=Column(String)
    bio=Column(String)
    owner=relationship("Users", back_populates="profile")

profile = relationship("UserProfile", back_populates="owner", uselist= False)


