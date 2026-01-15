from typing import Annotated
from models.auth.user import Users
from sqlalchemy.orm import Session

def create_signup_user(db: Session, username: str, hashed_password: str, ranking: str):
    user=Users(username=username, hashed_password=hashed_password, ranking=ranking)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def get_user(db: Session, username:str):
    return db.query(Users).filter(Users.username == username).first()