from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from database import Base

class WorkspaceItem(Base):
    __tablename__ = "workspace_items"

    id = Column(Integer, primary_key=True)
    username = Column(String, ForeignKey("users.username"), nullable=False)
    title = Column(String, nullable=False)
    url = Column(String, nullable=True)
    platform = Column(String, nullable=True)  # e.g., "leetcode", "codeforces"
    done = Column(Boolean, default=False)
    category = Column(String, nullable=False)  # "attempted", "marked", "important"