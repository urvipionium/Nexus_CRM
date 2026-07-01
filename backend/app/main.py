from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import auth
from app.routes import customers
from app.routes import users
from app.routes import leads
from app.routes import deals
from app.routes import tasks
from app.routes import dashboard


app = FastAPI()


# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    dashboard.router,
    prefix="/dashboard",
    tags=["Dashboard"]
)
app.include_router(auth.router)
app.include_router(customers.router)
app.include_router(users.router)
app.include_router(leads.router)
app.include_router(deals.router)
app.include_router(tasks.router)


app.include_router(
    leads.router,
    prefix="/leads",
    tags=["Leads"]
)

@app.get("/")
def home():
    return {
        "message": "CRM Backend Running",
        "message": "Auth Working"
    }
    
