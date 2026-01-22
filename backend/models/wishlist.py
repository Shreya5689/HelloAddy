from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
from models.auth.user import Users

class UserItem(Base):
    __tablename__ = "user_items"

    id = Column(Integer, primary_key=True)
    username = Column(String, ForeignKey("users.username"), nullable=False)
    type = Column(String, nullable=False)  # "todo" | "wishlist"
    value = Column(String, nullable=False)
    done = Column(Boolean, default=False)
