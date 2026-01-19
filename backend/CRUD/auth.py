from typing import Annotated
from models.auth.user import Users
from sqlalchemy.orm import Session
from models.auth.user import UserProfile

def create_signup_user(db: Session, username: str, hashed_password: str, ranking: str, email: str):
    user=Users(username=username, hashed_password=hashed_password, ranking=ranking, email =email)
    db.add(user)
    db.commit()
    db.refresh(user)

    profile = UserProfile(user_id=user.id)
    db.add(profile)
    db.commit()
    db.refresh(user)
    return user

def get_user(db: Session, username:str):
    return db.query(Users).filter(Users.username == username).first()