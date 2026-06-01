from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_leads():

    return [
        {
            "id": 1,
            "name": "Harsh Rai",
            "status": "New Lead"
        },
        {
            "id": 2,
            "name": "Rahul",
            "status": "Qualified"
        }
    ]