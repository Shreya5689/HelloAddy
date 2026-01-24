from fastapi import FastAPI,Depends,HTTPException
import strawberry
# from strawberry.fastapi import GraphqlRouter
# from schemas.leetcode.schema import schema
from routes import auth, problems, wishlist, workspace
from database import engine, Base
from fastapi.middleware.cors import CORSMiddleware
Base.metadata.create_all(bind=engine)



app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# app.include_router(, prefix="/graphql")
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(problems.router, prefix="/problems", tags=["problems"])
app.include_router(wishlist.router, prefix="/wishlist", tags=["wishlist"])
app.include_router(workspace.router, prefix="/workspace", tags=["workspace"])

# def add(a: int, b: int) -> int:
#     return a+b

@app.get("/")
def main():
    print("Assalamuailikum Lyari")
    add (3,4)
    return "Assalailikum, lyari"