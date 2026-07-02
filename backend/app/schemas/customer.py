from pydantic import BaseModel, EmailStr
from typing import Optional


class CustomerBase(BaseModel):
    name: str
    email: EmailStr
    phone: str
    company: Optional[str] = None


class CustomerCreate(CustomerBase):
    pass


class CustomerUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    company: Optional[str] = None


class CustomerResponse(CustomerBase):
    id: int

    model_config = {
        "from_attributes": True
    }