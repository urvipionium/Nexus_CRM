from sqlalchemy.orm import Session
from app.models.task import Task


def get_tasks(db: Session):
    return db.query(Task).all()