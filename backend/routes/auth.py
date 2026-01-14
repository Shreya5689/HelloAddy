from datetime import datetime,timedelta
from typing import Annotated
from fastapi import APIRouter,Depends,HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from starlette import status
from database import get_db
from schemas.auth.login_request import CreateUserRequest, CreateUserSignupRequest
from schemas.auth.Token import Token
from models.auth.user import Users
import bcrypt
from fastapi.security import OAuth2PasswordBearer,OAuth2PasswordRequestForm,HTTPAuthorizationCredentials,HTTPBearer
from jose import jwt, JWTError
from CRUD.auth import get_user, create_signup_user
from utils import auth
from fastapi import Response,Request


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

        return {
        "message": "Welcome",
        "access_token": access_token
        }
    

@router.post("/signup", status_code=status.HTTP_201_CREATED)
async def create_user(response:Response, db: Annotated[Session,Depends(get_db)], create_user_request:CreateUserSignupRequest):
    hashed_password = auth.hash_password(create_user_request.password)
    user = get_user(db, create_user_request.username)
    
    if user:
        return {"message":"User already exists"}
    else:
        create_signup_user(
            db=db,
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
def validate_token(credentials: HTTPAuthorizationCredentials = Depends(oauth2_scheme)):
    payload = auth.verify_token(credentials.credentials)
    print(payload)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )

    return {
        "valid": True,
        "payload": payload
    }


@router.post("/refresh")
def use_refresh_token(request: Request, db: Annotated[Session,Depends(get_db)]):
    refresh_token=request.cookies.get("refresh_token")
    payload= auth.verify_token(refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User signup again"
        )
    username = payload.get("sub")
    user = get_user(db, username)
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



