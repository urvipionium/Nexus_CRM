from sqlalchemy.orm import Session

from app.crud.customer import (
    get_all_customers,
    get_customer_by_id,
    create_customer,
    delete_customer,
)

from app.schemas.customer import CustomerCreate


def fetch_all_customers(db: Session):
    return get_all_customers(db)


def fetch_customer(db: Session, customer_id: int):
    return get_customer_by_id(db, customer_id)


def add_customer(db: Session, customer: CustomerCreate):
    return create_customer(db, customer)


def remove_customer(db: Session, customer_id: int):
    return delete_customer(db, customer_id)