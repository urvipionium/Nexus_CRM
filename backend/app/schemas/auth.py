from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):

    email: EmailStr

    password: str


class RegisterRequest(BaseModel):

    username: str

    email: EmailStr

    password: str

    role_id: int


class Token(BaseModel):

    access_token: str

    token_type: str


class TokenData(BaseModel):

    email: str | None = None