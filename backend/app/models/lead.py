from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import ForeignKey
from sqlalchemy import DateTime
from sqlalchemy.sql import func

from app.database.base import Base


class Lead(Base):

    __tablename__ = "leads"

    id = Column(Integer, primary_key=True)

    customer_id = Column(Integer,ForeignKey("customers.id"))

    assigned_to = Column(Integer,ForeignKey("employees.id"))

    source = Column(String(100))

    status = Column(String(50))

    created_at = Column(DateTime(timezone=True),server_default=func.now())