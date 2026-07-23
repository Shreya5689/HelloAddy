from pydantic import BaseModel
from typing import List

class ProblemItem(BaseModel):
    title: str
    difficulty: str
    url: str
    platform: str
    paid_only: bool = False
    topic: str

class SaveSheetRequest(BaseModel):
    name: str
    problems: List[ProblemItem]

from typing import List, Optional

class CheckboxRequest(BaseModel):
    codeforces_tags: Optional[List[str]] = []
    leetcode_tags: Optional[List[str]] = []

