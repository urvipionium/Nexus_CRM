from sqlalchemy.orm import Session

from app.crud.user import (
    get_users,
    get_user_by_id,
    create_user,
)

from app.schemas.user import UserCreate


def fetch_all_users(db: Session):
    return get_users(db)


def fetch_user(db: Session, user_id: int):
    return get_user_by_id(db, user_id)


def add_user(db: Session, user: UserCreate):
    return create_user(db, user)