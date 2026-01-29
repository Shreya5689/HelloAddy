from pydantic import BaseModel
from typing import Optional

class AddAttemptedRequest(BaseModel):
    title: str
    url: Optional[str] = None
    platform: Optional[str] = None
    done: bool = False
    category: str = "attempted" # 
    

