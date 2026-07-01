from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import DateTime
from sqlalchemy import ForeignKey

from app.database.base import Base


class Task(Base):

    __tablename__ = "tasks"

    id = Column(Integer,primary_key=True)

    title = Column(String(255))

    description = Column(String(500))

    assigned_to = Column(Integer,ForeignKey("employees.id"))

    status = Column(String(50))

    due_date = Column(DateTime)