# police_assignment.py — run on port 8004

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pymongo import MongoClient
from dotenv import load_dotenv
import certifi, os, csv
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from datetime import datetime

load_dotenv()

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
        return  # already loaded

    with open("officers.csv", newline="") as f:
        reader = csv.DictReader(f)
        officers = []
        for row in reader:
            name = row["name"].strip()
            role = row["role"].strip()
            # Auto-generate email from name
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
        {"status": "submitted"},   
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
        {"status": "assigned"},
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

    # ✅ When case is resolved or rejected, free up the officer
    if data.status in ["resolved", "rejected"]:
        assigned_officer = fir.get("assigned_officer")
        if assigned_officer:
            officers_collection.update_one(
                {"name": assigned_officer},
                {
                    "$inc": {"active_cases": -1},   # decrease case count
                    "$set": {"status": "Available"}  # set back to available
                }
            )

    send_status_update_email(
        to_email=fir.get("email"),
        full_name=fir.get("full_name"),
        fir_id=data.fir_id,
        new_status=data.status
    )

    return {"message": f"FIR {data.fir_id} status updated to {data.status}"}
# -----------------------------
# Email: Notify Citizen on Status Change
# -----------------------------
def send_status_update_email(to_email, full_name, fir_id, new_status):
    SENDGRID_API_KEY = os.getenv("SENDGRID_API_KEY")
    if not SENDGRID_API_KEY or not to_email:
        print("SendGrid key or email missing")
        return

    status_messages = {
        "under_review": "Your FIR is currently under review by the assigned officer.",
        "resolved":     "Your FIR has been resolved. The case is now closed.",
        "rejected":     "Your FIR has been reviewed and unfortunately rejected."
    }

    content = f"""
Dear {full_name},

Your FIR status has been updated.

FIR Reference ID : {fir_id}
New Status       : {new_status.upper()}

{status_messages.get(new_status, "")}

Please log in to the Citizen Portal to view full details.

Regards,
FIR Management System
    """

    message = Mail(
        from_email=os.getenv("MAIL_FROM"),
        to_emails=to_email,
        subject=f"FIR Status Update: {fir_id} - {new_status.upper()}",
        plain_text_content=content
    )

    try:
        sg = SendGridAPIClient(SENDGRID_API_KEY)
        response = sg.send(message)
        print(f"Status update email sent to {to_email}, status: {response.status_code}")
    except Exception as e:
        print("Email error:", e)
# -----------------------------
# POST: Assign Officer to FIR
# -----------------------------
class AssignRequest(BaseModel):
    fir_id: str
    officer_name: str

@app.post("/assign-officer")
async def assign_officer(data: AssignRequest):

    # Get officer details
    officer = officers_collection.find_one({"name": data.officer_name}, {"_id": 0})
    if not officer:
        return {"error": "Officer not found"}

    # Get FIR details
    fir = firs_collection.find_one({"reference_id": data.fir_id})
    if not fir:
        return {"error": "FIR not found"}

    # Update FIR with assigned officer
    firs_collection.update_one(
        {"reference_id": data.fir_id},
        {"$set": {
            "assigned_officer": data.officer_name,
            "assigned_officer_email": officer["email"],
            "status": "assigned"
        }}
    )
    # Update officer active cases count and status
    officers_collection.update_one(
        {"name": data.officer_name},
        {
            "$inc": {"active_cases": 1},
            "$set": {"status": "Busy"}  # ✅ added
        }
    )

    # Send email to officer
    send_assignment_email(
        to_email=officer["email"],
        officer_name=officer["name"],
        fir_id=data.fir_id,
        crime_category=fir.get("crime_category", "N/A"),
        location=fir.get("location", "N/A"),
        date=fir.get("date_of_incident", "N/A")
    )

    return {
        "message": f"FIR {data.fir_id} assigned to {data.officer_name} successfully",
        "officer_email": officer["email"]
    }

# -----------------------------
# Email: Notify Officer
# -----------------------------
def send_assignment_email(to_email, officer_name, fir_id, crime_category, location, date):
    SENDGRID_API_KEY = os.getenv("SENDGRID_API_KEY")
    if not SENDGRID_API_KEY:
        print("SendGrid key missing")
        return

    content = f"""
Dear {officer_name},

You have been assigned a new FIR. Please review the details below:

FIR Reference ID : {fir_id}
Crime Category   : {crime_category}
Location         : {location}
Date of Incident : {date}

Please log in to the Police Portal to review the full case details.

Regards,
FIR Management System
    """

    message = Mail(
        from_email=os.getenv("MAIL_FROM"),
        to_emails=to_email,
        subject=f"New FIR Assigned: {fir_id}",
        plain_text_content=content
    )

    try:
        sg = SendGridAPIClient(SENDGRID_API_KEY)
        response = sg.send(message)
        print(f"Assignment email sent to {to_email}, status: {response.status_code}")
    except Exception as e:
        print("Email error:", e)