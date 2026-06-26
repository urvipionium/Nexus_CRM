from app.database.connection import SessionLocal, engine
from app.models.customer import Customer

db = SessionLocal()

admin = db.query(Customer).filter(Customer.email == "admin@crm.com").first()

if not admin:
    admin = Customer(
        name="Admin",
        email="admin@crm.com"
    )

    db.add(admin)
    db.commit()

db.close()