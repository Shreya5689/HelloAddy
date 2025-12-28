from typing import Annotated
from models.auth.user import Users
from sqlalchemy.orm import Session

def create_user(db: Session, username: str, hashed_password: str):
    user=Users(username=username, hashed_password=hashed_password)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def get_user(db: Session, username:str):
    return db.query(Users).filter(Users.username == username).first()