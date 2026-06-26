from sqlalchemy.orm import declarative_base, sessionmaker

Base = declarative_base()

from app.models.customer import Customer
from app.models.user import user
from app.models.lead import Lead
from app.models.task import Task

