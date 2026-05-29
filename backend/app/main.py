from fastapi import FastAPI

from app.routes.dashboard import router as dashboard_router

app = FastAPI()

app.include_router(
    dashboard_router,
    prefix="/dashboard",
    tags=["Dashboard"]
)

@app.get("/")
def home():
    return {
        "message": "CRM Backend Running"
    }