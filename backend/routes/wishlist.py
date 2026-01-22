from fastapi import APIRouter, Depends,HTTPException
from sqlalchemy.orm import Session
from models.auth.user import Users
from models.wishlist import UserItem
from database import get_db
from utils import auth
from CRUD.auth import get_user
from schemas.wishlist.wishlist import Add_item_Request
from typing import Annotated


router=APIRouter()


@router.post("/items")
def add_item(item: Add_item_Request,
             db: Annotated[Session, Depends(get_db)],
             user: dict = Depends(auth.get_current_user)
):
    new_item = UserItem(
        username=user["sub"],
        type=item.type,
        value=item.value,
        done=False
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

@router.get("/item")
def get_items(db: Annotated[Session, Depends(get_db)],
              user: dict = Depends(auth.get_current_user)
):
    # This filters the UserItem table by the username found in the user's token
    items = db.query(UserItem).filter(UserItem.username == user["sub"]).all()
    return items
# @router.patch("/items/{item_id}")
# def toggle_item(
#     item_id: int,
#     user=Depends(get_user),
#     db: Session = Depends(get_db)
# ):
#     item = db.query(UserItem).filter(
#         UserItem.id == item_id,
#         UserItem.user_id == user.id
#     ).first()

#     item.done = not item.done
#     db.commit()
#     return item

# @router.put("/items/{item_id}")
# def edit_item(
#     item_id: int,
#     data: dict,
#     user=Depends(get_user),
#     db: Session = Depends(get_db)
# ):
#     item = db.query(UserItem).filter(
#         UserItem.id == item_id,
#         UserItem.user_id == user.id
#     ).first()

#     item.value = data["value"]
#     db.commit()
#     return item

