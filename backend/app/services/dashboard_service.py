from sqlalchemy.orm import Session

from app.models.customer import Customer
from app.models.lead import Lead
from app.models.deal import Deal


def dashboard_summary(db: Session):

    return {
        "customers": db.query(Customer).count(),
        "leads": db.query(Lead).count(),
        "deals": db.query(Deal).count(),
    } 
    
    