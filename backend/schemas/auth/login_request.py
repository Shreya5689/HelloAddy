from pydantic import BaseModel

class CreateUserRequest(BaseModel):
    username: str
    email:str
    password: str

class CreateUserSignupRequest(CreateUserRequest):
    username: str
    email: str
    ranking: str


