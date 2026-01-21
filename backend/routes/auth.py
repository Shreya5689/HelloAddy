from datetime import datetime,timedelta
from typing import Annotated
from fastapi import APIRouter,Depends,HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from starlette import status
from database import get_db
from schemas.auth.login_request import CreateUserRequest, CreateUserSignupRequest
from schemas.auth.Token import Token
from models.auth.user import Users, UserProfile
import bcrypt
from fastapi.security import OAuth2PasswordBearer,OAuth2PasswordRequestForm,HTTPAuthorizationCredentials,HTTPBearer
from jose import jwt, JWTError
from CRUD.auth import get_user, create_signup_user,get_profile, get_user_by_email, save_user_otp,get_user_otp, update_user_password, delete_user_otp
from utils import auth,email_very
from fastapi import Response,Request
from models.auth.user import Users
from utils.email_very import send_reset_password_email
from schemas.auth.otp_request import OtpRequest, ResetPasswordRequest
from utils.auth import generate_otp





router = APIRouter()

@router.post("/login", status_code=status.HTTP_201_CREATED)
async def login(response:Response, db: Annotated[Session, Depends(get_db)], create_user_request:CreateUserRequest):
    hashed_password = auth.hash_password(create_user_request.password)

    user = get_user(db, create_user_request.username)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    else:

        refresh_token_expires=timedelta(days=auth.REFRESH_TOKEN_EXPIRES_DAYS)
        access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRES_MINUTES)
        access_token = auth.create_token(
            data={"sub":create_user_request.username, "type": "access"}, expires_delta=access_token_expires)
        
        refresh_token= auth.create_token(
            data={"sub":create_user_request.username, "type": "refresh"}, expires_delta=refresh_token_expires)
        
        
        response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=False,          
        samesite="lax",
        max_age=7 * 24 * 60 * 60,
        path="/refresh"        
        )
        profile = get_profile(db, user.username)

        return {
        "message": "Welcome",
        "access_token": access_token
        }
    

@router.post("/signup", status_code=status.HTTP_201_CREATED)
async def create_user(response:Response, db: Annotated[Session,Depends(get_db)], create_user_request:CreateUserSignupRequest):
    print(create_user_request)
    hashed_password = auth.hash_password(create_user_request.password)
    user = get_user(db, create_user_request.username)
    if user:
        return {"message":"User already exists"}
    else:
        create_signup_user(
            db=db,
            email= create_user_request.email,
            username=create_user_request.username,
            hashed_password=hashed_password,
            ranking=create_user_request.ranking
        )
        # print(new_user)
        refresh_token_expires=timedelta(days=auth.REFRESH_TOKEN_EXPIRES_DAYS)
        access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRES_MINUTES)
        access_token = auth.create_token(
            data={"sub":create_user_request.username, "type": "access"}, expires_delta=access_token_expires)
        
        refresh_token= auth.create_token(
            data={"sub":create_user_request.username, "type": "refresh"}, expires_delta=refresh_token_expires)
        
        
        response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=False,          
        samesite="lax",
        max_age=7 * 24 * 60 * 60,
        path="/refresh"        
        )

        return {
        "message": "User created successfully",
        "access_token": access_token
        }

oauth2_scheme = HTTPBearer()
@router.get("/billu")
def validate_token(db: Annotated[Session,Depends(get_db)], credentials: HTTPAuthorizationCredentials = Depends(oauth2_scheme)):
    payload = auth.verify_token(credentials.credentials)
    print(payload)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
    
    user = get_user(db, payload.get("sub"))
    profile = get_profile(db, payload.get("sub"))
    bio = profile.bio
    ranking = profile.ranking
    return {
        "valid": True,
        "username": payload.get("sub"),
        "ranking": ranking,
        "email":user.email,
        "bio":bio
    }


@router.post("/refresh")
def use_refresh_token(request: Request, db: Annotated[Session,Depends(get_db)]):
    refresh_token=request.cookies.get("refresh_token")
    print(refresh_token)
    payload= auth.verify_token(refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User signup again"
        )
    username = payload.get("sub")
    user = get_user(db, username)
    print(user)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )

    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRES_MINUTES)
    access_token = auth.create_token(
        data={"sub": username, "type": "access"},
        expires_delta=access_token_expires
    )

    return {
        "access_token": access_token,
        "message": "refresh successful"
    }



@router.post("/forgot-password")
async def forgot_password(otp_req: OtpRequest, db: Annotated[Session, Depends(get_db)]):
    user = get_user_by_email(db, otp_req.email)
    if not user:
        raise HTTPException(status_code=404, detail="User with this email not found")
    otp = generate_otp()
    expires_at = datetime.utcnow() + timedelta(minutes=10)
    save_user_otp(db, user.username, otp, expires_at)
    
    success = send_reset_password_email(user.email, otp)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to send email")
    return {"message": "OTP sent to your email"}


@router.post("/reset-password")
async def reset_password(req: ResetPasswordRequest, db: Annotated[Session, Depends(get_db)]):
    # 1. Verify user exists
    user = get_user_by_email(db, req.email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    # 2. Retrieve the stored OTP
    db_otp = get_user_otp(db, user.username)
    if not db_otp:
        raise HTTPException(status_code=400, detail="No OTP found for this user")
    # 3. Check OTP validity and expiration
    if db_otp.otp != req.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")
    
    if datetime.utcnow() > db_otp.expires_at:
        raise HTTPException(status_code=400, detail="OTP has expired")
    # 4. Hash new password and update user record
    hashed_password = auth.hash_password(req.password)
    update_user_password(db, user.username, hashed_password)
    # 5. Delete OTP record after successful use
    delete_user_otp(db, user.username)
    return {"message": "Password reset successfully"}



