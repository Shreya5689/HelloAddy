from typing import Annotated
from models.auth.user import Users
from sqlalchemy.orm import Session
from models.auth.user import UserProfile

def create_signup_user(db: Session, username: str, hashed_password: str, ranking: str, email: str):
    user=Users(username=username, hashed_password=hashed_password, email =email)
    db.add(user)
    db.commit()
    db.refresh(user)

    profile = UserProfile(username=username,ranking= ranking, bio="")
    db.add(profile)
    db.commit()
    db.refresh(profile)

def get_user(db: Session, username:str):
    return db.query(Users).filter(Users.username == username).first()

def get_profile(db: Session, username:str):
    return db.query(UserProfile).filter(UserProfile.username == username).first()