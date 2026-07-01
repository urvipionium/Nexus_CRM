from fastapi import APIRouter

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)

@router.get("/")
def get_dashboard_summary():

    return {
        "total_customers": 120,
        "total_leads": 35,
        "total_deals": 18,
        "total_revenue": 1500000
    }