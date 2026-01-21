from typing import Annotated
from models.auth.user import Users
from sqlalchemy.orm import Session
from models.auth.user import UserProfile
from models.auth.user import UserOTP
from datetime import datetime

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

def get_user_by_email(db: Session, email: str):
    return db.query(Users).filter(Users.email == email).first()

def save_user_otp(db: Session, username: str, otp: str, expires_at):
    db_otp = db.query(UserOTP).filter(UserOTP.username == username).first()
    if db_otp:
        db_otp.otp = otp
        db_otp.expires_at = expires_at
        db_otp.created_at = datetime.utcnow()
    else:
        db_otp = UserOTP(username=username, otp=otp, expires_at=expires_at)
        db.add(db_otp)
    db.commit()
    db.refresh(db_otp)
    return db_otp
def get_user_otp(db: Session, username: str):
    return db.query(UserOTP).filter(UserOTP.username == username).first()

def update_user_password(db: Session, username: str, hashed_password: str):
    user = db.query(Users).filter(Users.username == username).first()
    if user:
        user.hashed_password = hashed_password
        db.commit()
    return user

def delete_user_otp(db: Session, username: str):
    db_otp = db.query(UserOTP).filter(UserOTP.username == username).first()
    if db_otp:
        db.delete(db_otp)
        db.commit()