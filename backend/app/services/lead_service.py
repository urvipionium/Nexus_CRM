from sqlalchemy.orm import Session

from app.crud.lead import (
    get_leads,
    create_lead,
)

from app.schemas.lead import LeadCreate


def fetch_all_leads(db: Session):
    return get_leads(db)


def add_lead(db: Session, lead: LeadCreate):
    return create_lead(db, lead)