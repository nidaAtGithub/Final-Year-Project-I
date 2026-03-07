# fir_management.py — run on port 8005
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pymongo import MongoClient
from datetime import datetime
import certifi, os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
import httpx
from notification import send_status_update_email
load_dotenv()


# ─── Notification Helper ──────────────────────────────────────────────────────
async def send_notification(email: str, fir_id: str, title: str, message: str, status: str):
    try:
        async with httpx.AsyncClient() as c:
            await c.post("http://localhost:8008/statusCheck/create", json={
                "email": email,
                "fir_id": fir_id,
                "title": title,
                "message": message,
                "status": status
            })
    except Exception as e:
        print(f"Notification error: {e}")

client = MongoClient(os.getenv("MONGO_URI"), tlsCAFile=certifi.where())
db = client["fir_db"]
firs_collection = db["firs"]
officers_collection = db["officers"]

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# -----------------------------
# GET: All FIRs for admin (excluding drafts)
# -----------------------------
@app.get("/admin/get-all-firs")
async def get_all_firs(status: str = None, crime_category: str = None, search: str = None):
    query = {"status": {"$ne": "draft"}}  # exclude drafts

    if status and status != "all":
        query["status"] = status

    if crime_category and crime_category != "all":
        query["crime_category"] = crime_category

    if search:
        query["$or"] = [
            {"reference_id": {"$regex": search, "$options": "i"}},
            {"crime_category": {"$regex": search, "$options": "i"}},
            {"full_name": {"$regex": search, "$options": "i"}},
        ]

    firs = list(firs_collection.find(
        query,
        {"_id": 0, "reference_id": 1, "crime_category": 1, "full_name": 1,
         "assigned_officer": 1, "status": 1, "location": 1, "date_of_incident": 1}
    ))
    return {"firs": firs}

# -----------------------------
# GET: FIR stats for admin dashboard
# -----------------------------
@app.get("/admin/fir-stats")
async def get_fir_stats():
    total = firs_collection.count_documents({"status": {"$ne": "draft"}})
    submitted = firs_collection.count_documents({"status": "submitted"})
    assigned = firs_collection.count_documents({"status": "assigned"})
    under_review = firs_collection.count_documents({"status": "under_review"})
    resolved = firs_collection.count_documents({"status": "resolved"})
    rejected = firs_collection.count_documents({"status": "rejected"})

    # Active cases = assigned + under_review
    active_cases = firs_collection.count_documents({
        "status": {"$in": ["assigned", "under_review"]}
    })

    # FIRs with an assigned officer regardless of status
    has_officer = firs_collection.count_documents({
        "assigned_officer": {"$exists": True, "$ne": None}
    })

    return {
        "total": total,
        "submitted": submitted,
        "assigned": assigned,
        "under_review": under_review,
        "resolved": resolved,
        "rejected": rejected,
        "active_cases": active_cases,   # assigned + under_review
        "has_officer": has_officer       # all FIRs with an officer
    }
# -----------------------------
# GET: Single FIR details
# -----------------------------
@app.get("/admin/get-fir-details/{reference_id}")
async def get_fir_details(reference_id: str):
    fir = firs_collection.find_one({"reference_id": reference_id}, {"_id": 0})
    if not fir:
        return {"error": "FIR not found"}
    return {"fir": fir}

# -----------------------------
# POST: Update FIR Status
# -----------------------------
# ─── Updated Status Update Request ───────────────────────────────────────────
class StatusUpdateRequest(BaseModel):
    fir_id: str
    status: str
    note: str = ""  #optional note

@app.post("/admin/update-fir-status")
async def update_fir_status(data: StatusUpdateRequest):
    valid_statuses = ["verified","under_review", "resolved", "rejected"]

    if data.status not in valid_statuses:
        return {"error": f"Invalid status. Must be one of: {valid_statuses}"}

    fir = firs_collection.find_one({"reference_id": data.fir_id})
    if not fir:
        return {"error": "FIR not found"}

    note_entry = None
    if data.note.strip():
        note_entry = {
            "status": data.status,
            "note": data.note.strip(),
            "timestamp": datetime.utcnow().isoformat()
        }

    update_fields = {
        "status": data.status,
        "updated_at": datetime.utcnow().isoformat()
    }

    update_query = {"$set": update_fields}
    if note_entry:
        update_query["$push"] = {"status_notes": note_entry}

    firs_collection.update_one(
        {"reference_id": data.fir_id},
        update_query
    )

    if data.status in ["resolved", "rejected"]:
        assigned_officer = fir.get("assigned_officer")
        if assigned_officer:
            officers_collection.update_one(
                {"name": assigned_officer},
                {
                    "$inc": {"active_cases": -1},
                    "$set": {"status": "Available"}
                }
            )

    send_status_update_email(
        to_email=fir.get("email"),
        full_name=fir.get("full_name"),
        fir_id=data.fir_id,
        new_status=data.status,
        note=data.note
    )

    #Send in-app notification to citizen
    status_titles = {
        "verified": "FIR Verified",
        "under_review": "FIR Under Investigation",
        "resolved":     "FIR Resolved",
        "rejected":     "FIR Rejected"
    }
    status_messages = {
        "verified":     f"Your FIR {data.fir_id} has been verified by the admin.",
        "under_review": f"Your FIR {data.fir_id} is now under investigation by the assigned officer.",
        "resolved":     f"Your FIR {data.fir_id} has been resolved. The case is now closed.",
        "rejected":     f"Your FIR {data.fir_id} has been reviewed and unfortunately rejected."
    }
    note_suffix = f" Note: {data.note}" if data.note.strip() else ""

    await send_notification(
        email=fir.get("email"),
        fir_id=data.fir_id,
        title=status_titles.get(data.status, "FIR Status Updated"),
        message=status_messages.get(data.status, "") + note_suffix,
        status=data.status
    )

    return {"message": f"FIR {data.fir_id} status updated to {data.status}"}

# -----------------------------
# DELETE: Delete FIR
# -----------------------------
@app.delete("/admin/delete-fir/{reference_id}")
async def delete_fir(reference_id: str):
    fir = firs_collection.find_one({"reference_id": reference_id})
    if not fir:
        return {"error": "FIR not found"}

    # Free up officer if one was assigned
    assigned_officer = fir.get("assigned_officer")
    if assigned_officer:
        officers_collection.update_one(
            {"name": assigned_officer},
            {
                "$inc": {"active_cases": -1},
                "$set": {"status": "Available"}
            }
        )

    firs_collection.delete_one({"reference_id": reference_id})
    return {"message": f"FIR {reference_id} deleted successfully"}

# -----------------------------
# GET: Dashboard stats
# -----------------------------
@app.get("/admin/dashboard-stats")
async def get_dashboard_stats():
    total_citizens = db["login_users"].count_documents({})
    total_officers = db["officers"].count_documents({})
    suspended_officers = db["officers"].count_documents({"status": "suspended"})

    return {
        "total_citizens": total_citizens,
        "total_officers": total_officers,
        "suspended_officers": suspended_officers
    }