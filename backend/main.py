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
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1",
    ],
    allow_origin_regex=r"https://.*\.shreya-projects\.site|http://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# app.include_router(, prefix="/graphql")
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(problems.router, prefix="/problems", tags=["problems"])
app.include_router(wishlist.router, prefix="/wishlist", tags=["wishlist"])
app.include_router(workspace.router, prefix="/workspace", tags=["workspace"])

from fastapi.responses import JSONResponse
from fastapi import Request

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc)},
    )

@app.get("/")
def main():
    print("Assalamuailikum Lyari")
    return "Assalamuailikum, lyari"