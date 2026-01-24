from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from utils import auth
from typing import Annotated
from models.workspace import WorkspaceItem
from schemas.workspace import AddAttemptedRequest

router = APIRouter()


@router.get("")
def get_workspace(
    db: Annotated[Session, Depends(get_db)],
    user: dict = Depends(auth.get_current_user)
):
    """
    GET /workspace
    Returns all workspace items for the logged-in user
    """
    items = db.query(WorkspaceItem).filter(
        WorkspaceItem.username == user["sub"]
    ).all()

    # Group items by category
    attempted = [item for item in items if item.category == "attempted"]
    marked = [item for item in items if item.category == "marked"]
    important = [item for item in items if item.category == "important"]

    return {
        "attempted": attempted,
        "marked": marked,
        "important": important
    }


@router.post("/attempted")
def add_attempted(
    item: AddAttemptedRequest,
    db: Annotated[Session, Depends(get_db)],
    user: dict = Depends(auth.get_current_user)
):
    """
    POST /workspace/attempted
    Add a new attempted item
    """
    new_item = WorkspaceItem(
        username=user["sub"],
        title=item.title,
        url=item.url,
        platform=item.platform,
        done=item.done,
        category="attempted"
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item


@router.patch("/{item_id}")
def toggle_attempted(
    item_id: int,
    db: Annotated[Session, Depends(get_db)],
    user: dict = Depends(auth.get_current_user)
):
    """
    PATCH /workspace/:id
    Toggle the done status of an item
    """
    item = db.query(WorkspaceItem).filter(
        WorkspaceItem.id == item_id,
        WorkspaceItem.username == user["sub"]
    ).first()

    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    item.done = not item.done
    db.commit()
    db.refresh(item)
    return item


@router.delete("/attempted/{item_id}")
def remove_attempted(
    item_id: int,
    db: Annotated[Session, Depends(get_db)],
    user: dict = Depends(auth.get_current_user)
):
    """
    DELETE /workspace/attempted/:id
    Remove an attempted item
    """
    item = db.query(WorkspaceItem).filter(
        WorkspaceItem.id == item_id,
        WorkspaceItem.username == user["sub"]
    ).first()

    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    db.delete(item)
    db.commit()
    return {"message": "Item deleted successfully"}