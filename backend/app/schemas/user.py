from pydantic import BaseModel
from pydantic import EmailStr
from typing import Optional


class UserCreate(BaseModel):

    username: str

    email: EmailStr

    password: str

    role_id: int


class UserUpdate(BaseModel):

    username: Optional[str] = None

    email: Optional[EmailStr] = None

    password: Optional[str] = None

    role_id: Optional[int] = None

    is_active: Optional[bool] = None


class UserResponse(BaseModel):

    id: int

    username: str

    email: EmailStr

    role_id: int

    is_active: bool

    class Config:
        from_attributes = True