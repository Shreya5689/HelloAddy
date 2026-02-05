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

class CheckboxRequest(BaseModel):
    codeforces_tags: List[str]
    leetcode_tags: List[str]

