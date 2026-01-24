from pydantic import BaseModel
from typing import List
from database import Base

class Add_item_Request(BaseModel):
    type:str
    value:str

class UpdateItemRequest(BaseModel):
    done: bool | None = None
    value: str | None = None


