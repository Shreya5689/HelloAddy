from fastapi import APIRouter, Depends,HTTPException
from sqlalchemy.orm import Session
from models.auth.user import Users
from models.wishlist import UserItem
from database import get_db
from utils import auth
from CRUD.auth import get_user
from schemas.wishlist.wishlist import Add_item_Request, UpdateItemRequest
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

@router.patch("/item/{items_id}")
def toggle_item(
    items_id: int,
    db: Annotated[Session, Depends(get_db)],
    user: dict = Depends(auth.get_current_user)
):
    # Find the item that matches BOTH the ID and the current User's username
    item = db.query(UserItem).filter(
        UserItem.id == items_id,
        UserItem.username == user["sub"]
    ).first()

    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    # Flip the status (True -> False or False -> True)
    item.done = not item.done
    db.commit()
    db.refresh(item)
    return item




@router.delete("/items/{item_id}")
def delete_item(
    item_id: int,
    db: Annotated[Session, Depends(get_db)],
    user: dict = Depends(auth.get_current_user)
):
    # Find item owned by the logged-in user
    item = db.query(UserItem).filter(
        UserItem.id == item_id,
        UserItem.username == user["sub"]
    ).first()

    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    db.delete(item)
    db.commit()

    return {"message": "Item deleted successfully"}

@router.put("/items/{items_id}")
def update_item_value(
    items_id: int,
    data: UpdateItemRequest,
    db: Annotated[Session, Depends(get_db)],
    user: dict = Depends(auth.get_current_user)
):
    # Find the item belonging to the current user
    item = db.query(UserItem).filter(
        UserItem.id == items_id,
        UserItem.username == user["sub"]
    ).first()

    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    if data.value is None:
        raise HTTPException(status_code=400, detail="Value is required")

    # Update the value
    item.value = data.value
    db.commit()
    db.refresh(item)

    return item

