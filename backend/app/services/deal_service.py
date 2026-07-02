from sqlalchemy.orm import Session

from app.crud.deal import get_deals


def fetch_all_deals(db: Session):
    return get_deals(db)