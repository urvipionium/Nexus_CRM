from sqlalchemy.orm import Session
from app.models.deal import Deal


def get_deals(db: Session):
    return db.query(Deal).all()