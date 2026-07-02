from sqlalchemy.orm import Session
from app.models.lead import Lead
from app.schemas.lead import LeadCreate


def get_leads(db: Session):
    return db.query(Lead).all()


def create_lead(db: Session, lead: LeadCreate):

    db_lead = Lead(**lead.model_dump())

    db.add(db_lead)

    db.commit()

    db.refresh(db_lead)

    return db_lead