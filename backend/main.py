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
    allow_origins=[
        "https://studymate.shreya-projects.site",
        "http://studymate.shreya-projects.site",
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost",
    ],
    allow_origin_regex=r"https://.*\.shreya-projects\.site",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# app.include_router(, prefix="/graphql")
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(problems.router, prefix="/problems", tags=["problems"])
app.include_router(wishlist.router, prefix="/wishlist", tags=["wishlist"])
app.include_router(workspace.router, prefix="/workspace", tags=["workspace"])

@app.get("/")
def main():
    print("Assalamuailikum Lyari")
    return "Assalamuailikum, lyari"