from datetime import datetime,timedelta
from typing import Annotated
from fastapi import APIRouter,Depends,HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from starlette import status
from database import get_db
from schemas.auth.login_request import CreateUserRequest
from schemas.auth.Token import Token
from models.auth.user import Users
import bcrypt
from fastapi.security import OAuth2PasswordBearer,OAuth2PasswordRequestForm
from jose import jwt, JWTError
from CRUD.auth import get_user

router = APIRouter()

SECRETKEY="Billu@123"
ALGORITHM="HS256"

oauth2_bearer=OAuth2PasswordBearer(tokenUrl="auth/login/token")

def hash_password(password:str)->str:
    password_bytes= password.encode("utf-8")
    salt=bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes,salt)
    return hashed.decode("utf-8")



@router.post("/login", status_code=status.HTTP_201_CREATED)
async def login(db: Annotated[Session, Depends(get_db)], create_user_request:CreateUserRequest):
    hashed_password = hash_password(create_user_request.password)

    user = get_user(db, create_user_request.username)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    else:
        return {"message":"User already exists"}
    # print(create_user_request)
    # print(hashed_password)

@router.post("/signup", status_code=status.HTTP_201_CREATED)
async def create_user(db: Annotated[Session,Depends(get_db)], create_user_request:CreateUserRequest):
    hashed_password = hash_password(create_user_request.password)
    user = get_user(db, create_user_request.username)
    if user:
        return {"message":"User already exists"}
    else:
        new_user = Users(
            username=create_user_request.username,
            hashed_password=hashed_password
        )
        db.add(new_user)
        db.commit()
        return {"message":"User created successfully"}
        
    # db.add()
    # db.commit()
