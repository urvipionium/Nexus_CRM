from pydantic import BaseModel
from datetime import datetime


class Message(BaseModel):
    message: str


class Pagination(BaseModel):
    page: int = 1
    limit: int = 10


class TimestampSchema(BaseModel):
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True