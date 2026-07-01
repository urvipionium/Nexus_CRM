from fastapi import APIRouter

router = APIRouter(
    prefix="/deals",
    tags=["Deals"]
)

@router.get("/")
def get_deals():
    return {"message": "Deals route working"}