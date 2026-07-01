from pydantic import BaseModel
from typing import Optional


class LeadCreate(BaseModel):

    customer_id: int

    assigned_to: int

    source: str

    status: str


class LeadUpdate(BaseModel):

    assigned_to: Optional[int] = None

    source: Optional[str] = None

    status: Optional[str] = None


class LeadResponse(BaseModel):

    id: int

    customer_id: int

    assigned_to: int

    source: str

    status: str

    class Config:
        from_attributes = True