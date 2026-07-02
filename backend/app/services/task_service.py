from sqlalchemy.orm import Session

from app.crud.task import get_tasks


def fetch_all_tasks(db: Session):
    return get_tasks(db)