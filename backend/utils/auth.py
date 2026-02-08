from fastapi import Depends,HTTPException,status
from datetime import datetime, timedelta
from fastapi.security import OAuth2PasswordBearer,OAuth2PasswordRequestForm,HTTPAuthorizationCredentials,HTTPBearer
from jose import JWTError, jwt
from CRUD.auth import get_user
import bcrypt
from database import get_db
import secrets
import string


SECRETKEY="Billu@123"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRES_MINUTES=0.1
REFRESH_TOKEN_EXPIRES_DAYS=7

oauth2_scheme = HTTPBearer()

def hash_password(password:str)->str:
    password_bytes= password.encode("utf-8")
    salt=bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes,salt)
    return hashed.decode("utf-8")


def create_token(data:dict, expires_delta: timedelta):
    to_encode = data.copy()
    if expires_delta:
        expire= datetime.utcnow() + expires_delta

    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRETKEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str):
    try:
        payload = jwt.decode(
            token,
            SECRETKEY,
            algorithms=[ALGORITHM]
        )
        return payload
    except JWTError:
        return None

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(oauth2_scheme)):
    token = credentials.credentials  # Extract token from "Bearer <token>"
    payload = verify_token(token)  # your function that checks token validity
    if not payload or payload.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired access token"
        )
    return payload

def generate_otp(length: int = 6):
    return "".join(secrets.choice(string.digits) for _ in range(length))