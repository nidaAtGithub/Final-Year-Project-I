# police_assignment.py — run on port 8004
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pymongo import MongoClient
from dotenv import load_dotenv
import certifi, os, csv, httpx
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from datetime import datetime
from notification import send_status_update_email,send_assignment_email


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
# Load CSV into MongoDB once
# -----------------------------
def load_officers_from_csv():
    if officers_collection.count_documents({}) > 0:
        return

    with open("officers.csv", newline="") as f:
        reader = csv.DictReader(f)
        officers = []
        for row in reader:
            name = row["name"].strip()
            role = row["role"].strip()
            email = name.lower().replace(" ", ".") + "@police.gov.pk"
            officers.append({
                "name": name,
                "role": role,
                "email": email,
                "status": "Available",
                "active_cases": 0
            })
        if officers:
            officers_collection.insert_many(officers)
            print(f"Loaded {len(officers)} officers into MongoDB")

load_officers_from_csv()

# -----------------------------
# GET: All Officers
# -----------------------------
@app.get("/get-officers")
async def get_officers():
    officers = list(officers_collection.find({}, {"_id": 0}))
    return {"officers": officers}

# -----------------------------
# GET: Unassigned FIRs
# -----------------------------
@app.get("/get-unassigned-firs")
async def get_unassigned_firs():
    firs = list(firs_collection.find(
        {
            "status": {"$in": ["submitted", "verified"]}, 
            "$or": [
                {"assigned_officer": {"$exists": False}},
                {"assigned_officer": None}
            ]
        },
        {"_id": 0, "reference_id": 1, "crime_category": 1, "full_name": 1,
         "location": 1, "date_of_incident": 1, "email": 1}
    ))
    return {"firs": firs}

# -----------------------------
# GET: Assigned FIRs
# -----------------------------
@app.get("/get-assigned-firs")
async def get_assigned_firs():
    firs = list(firs_collection.find(
        {
            "assigned_officer": {"$exists": True, "$ne": None},
            "status": {"$nin": ["submitted", "draft"]}
        },
        {"_id": 0, "reference_id": 1, "crime_category": 1, "full_name": 1,
         "location": 1, "date_of_incident": 1, "assigned_officer": 1, "status": 1}
    ))
    return {"firs": firs}

# -----------------------------
# GET: FIRs by any status
# -----------------------------
@app.get("/get-firs-by-status/{status}")
async def get_firs_by_status(status: str):
    firs = list(firs_collection.find(
        {"status": status},
        {"_id": 0, "reference_id": 1, "crime_category": 1, "full_name": 1,
         "location": 1, "date_of_incident": 1, "assigned_officer": 1, "status": 1}
    ))
    return {"firs": firs}

# -----------------------------
# POST: Update FIR Status
# -----------------------------
class StatusUpdateRequest(BaseModel):
    fir_id: str
    status: str

@app.post("/update-fir-status")
async def update_fir_status(data: StatusUpdateRequest):
    valid_statuses = ["under_review", "resolved", "rejected"]

    if data.status not in valid_statuses:
        return {"error": f"Invalid status. Must be one of: {valid_statuses}"}

    fir = firs_collection.find_one({"reference_id": data.fir_id})
    if not fir:
        return {"error": "FIR not found"}

    firs_collection.update_one(
        {"reference_id": data.fir_id},
        {"$set": {
            "status": data.status,
            "updated_at": datetime.utcnow().isoformat()
        }}
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
        new_status=data.status
    )

    # ✅ Send notification to citizen
    status_titles = {
        "verified": "FIR Verified",
        "under_review": "FIR Under Investigation",
        "resolved":     "FIR Resolved",
        "rejected":     "FIR Rejected"
    }
    status_messages = {
        "verified": f"Your FIR {data.fir_id} has been verified.",
        "under_review": f"Your FIR {data.fir_id} is now under investigation.",
        "resolved":     f"Your FIR {data.fir_id} has been resolved. Case closed.",
        "rejected":     f"Your FIR {data.fir_id} has been rejected."
    }

    await send_notification(
        email=fir.get("email"),
        fir_id=data.fir_id,
        title=status_titles.get(data.status, "FIR Status Updated"),
        message=status_messages.get(data.status, ""),
        status=data.status
    )

    return {"message": f"FIR {data.fir_id} status updated to {data.status}"}

# -----------------------------
# POST: Assign Officer to FIR
# -----------------------------
class AssignRequest(BaseModel):
    fir_id: str
    officer_name: str

@app.post("/assign-officer")
async def assign_officer(data: AssignRequest):
    officer = officers_collection.find_one({"name": data.officer_name}, {"_id": 0})
    if not officer:
        return {"error": "Officer not found"}

    fir = firs_collection.find_one({"reference_id": data.fir_id})
    if not fir:
        return {"error": "FIR not found"}

    firs_collection.update_one(
        {"reference_id": data.fir_id},
        {"$set": {
            "assigned_officer": data.officer_name,
            "assigned_officer_email": officer["email"],
            "status": "assigned"
        }}
    )

    officers_collection.update_one(
        {"name": data.officer_name},
        {
            "$inc": {"active_cases": 1},
            "$set": {"status": "Busy"}
        }
    )

    send_assignment_email(
        to_email=officer["email"],
        officer_name=officer["name"],
        fir_id=data.fir_id,
        crime_category=fir.get("crime_category", "N/A"),
        location=fir.get("location", "N/A"),
        date=fir.get("date_of_incident", "N/A")
    )

    # ✅ Notify citizen — officer assigned
    await send_notification(
        email=fir.get("email"),
        fir_id=data.fir_id,
        title="Officer Assigned",
        message=f"Officer {data.officer_name} has been assigned to your FIR {data.fir_id}.",
        status="assigned"
    )

    return {
        "message": f"FIR {data.fir_id} assigned to {data.officer_name} successfully",
        "officer_email": officer["email"]
    }

# -----------------------------
# POST: Reassign Officer
# -----------------------------
class ReassignRequest(BaseModel):
    fir_id: str
    new_officer_name: str

@app.post("/reassign-officer")
async def reassign_officer(data: ReassignRequest):
    fir = firs_collection.find_one({"reference_id": data.fir_id})
    if not fir:
        return {"error": "FIR not found"}

    new_officer = officers_collection.find_one({"name": data.new_officer_name})
    if not new_officer:
        return {"error": "New officer not found"}

    old_officer_name = fir.get("assigned_officer")

    if old_officer_name:
        officers_collection.update_one(
            {"name": old_officer_name},
            {
                "$inc": {"active_cases": -1},
                "$set": {"status": "Available"}
            }
        )

    firs_collection.update_one(
        {"reference_id": data.fir_id},
        {"$set": {
            "assigned_officer": data.new_officer_name,
            "assigned_officer_email": new_officer["email"],
        }}
    )

    officers_collection.update_one(
        {"name": data.new_officer_name},
        {
            "$inc": {"active_cases": 1},
            "$set": {"status": "Busy"}
        }
    )

    # ✅ Notify citizen — officer reassigned
    await send_notification(
        email=fir.get("email"),
        fir_id=data.fir_id,
        title="Officer Reassigned",
        message=f"Your FIR {data.fir_id} has been reassigned to Officer {data.new_officer_name}.",
        status="assigned"
    )

    return {"message": f"FIR {data.fir_id} reassigned from {old_officer_name} to {data.new_officer_name}"}