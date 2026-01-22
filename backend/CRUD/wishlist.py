from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from models.user import User
from models.user_item import UserItem
from database import get_db
from CRUD.auth import get_user
from models.wishlist import UserItem



@router.get("/items")
def get_items(user=Depends(get_user), db: Session = Depends(get_db)):
    return db.query(UserItem).filter(UserItem.user_id == user.id).all()
