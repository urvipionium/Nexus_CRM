from fastapi import APIRouter

router = APIRouter()

@router.get("/summary")
def get_dashboard_summary():

    return {
        "totalLeads": 120,
        "totalDeals": 45,
        "wonDeals": 20
    }