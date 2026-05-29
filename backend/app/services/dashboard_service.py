from models.lead import Lead
from models.deal import Deal

def get_dashboard_summary(db):

    total_leads = db.query(Lead).count()

    total_deals = db.query(Deal).count()

    won_deals = db.query(Deal).filter(
        Deal.status == "won"
    ).count()

    return {
        "totalLeads": total_leads,
        "totalDeals": total_deals,
        "wonDeals": won_deals
    }