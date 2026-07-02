from sqlalchemy.orm import Session
from app.models.customer import Customer
from app.schemas.customer import CustomerCreate


def get_all_customers(db: Session):
    return db.query(Customer).all()


def get_customer_by_id(db: Session, customer_id: int):
    return db.query(Customer).filter(Customer.id == customer_id).first()


def create_customer(db: Session, customer: CustomerCreate):

    db_customer = Customer(**customer.model_dump())

    db.add(db_customer)

    db.commit()

    db.refresh(db_customer)

    return db_customer


def delete_customer(db: Session, customer_id: int):

    customer = db.query(Customer).filter(
        Customer.id == customer_id).first()

    if customer:
        db.delete(customer)
        db.commit()

    return customer