from pydantic import BaseModel

class CreateUserRequest(BaseModel):
    username: str
    password: str

class CreateUserSignupRequest(CreateUserRequest):
    email: str
    ranking: str


