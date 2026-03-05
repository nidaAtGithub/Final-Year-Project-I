# fir_management.py — run on port 8005

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pymongo import MongoClient
from dotenv import load_dotenv
from datetime import datetime
import certifi, os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

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

    return {
        "total": total,
        "submitted": submitted,
        "assigned": assigned,
        "under_review": under_review,
        "resolved": resolved,
        "rejected": rejected
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
class StatusUpdateRequest(BaseModel):
    fir_id: str
    status: str

@app.post("/admin/update-fir-status")
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

    # Free up officer if case is resolved or rejected
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

    # Notify citizen via email
    send_status_update_email(
        to_email=fir.get("email"),
        full_name=fir.get("full_name"),
        fir_id=data.fir_id,
        new_status=data.status
    )

    return {"message": f"FIR {data.fir_id} status updated to {data.status}"}

# -----------------------------
# DELETE: Delete a FIR
# -----------------------------
@app.delete("/admin/delete-fir/{reference_id}")
async def delete_fir(reference_id: str):
    fir = firs_collection.find_one({"reference_id": reference_id})
    if not fir:
        return {"error": "FIR not found"}

    # Free up officer if FIR was assigned
    if fir.get("assigned_officer") and fir.get("status") not in ["resolved", "rejected"]:
        officers_collection.update_one(
            {"name": fir["assigned_officer"]},
            {
                "$inc": {"active_cases": -1},
                "$set": {"status": "Available"}
            }
        )

    firs_collection.delete_one({"reference_id": reference_id})
    return {"message": f"FIR {reference_id} deleted successfully"}

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
# Run
# -----------------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8005)