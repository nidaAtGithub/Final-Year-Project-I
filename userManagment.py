from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from pydantic import BaseModel
from dotenv import load_dotenv
import certifi
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
load_dotenv()

client = MongoClient(os.getenv("MONGO_URI"), tlsCAFile=certifi.where())
db = client["fir_db"]

citizens_collection = db["login_users"]   # collection for citizens
police_collection = db["officers"]     # collection for police officers


# ─── Helper: serialize MongoDB docs ───────────────────────────────────────────
def serialize_user(user: dict) -> dict:
    user["_id"] = str(user["_id"])
    user["full_name"] = user.get("full_name") or user.get("name") or user.get("username") or "Unknown"
    
    # Map "available" → "active" for frontend
    db_status = user.get("status", "available")
    if db_status == "available":
        user["status"] = "active"
    else:
        user["status"] = db_status

    return user

# ─── GET /admin/dashboard-stats ──────────────────────────────────────────────
@app.get("/admin/dashboard-stats")
def get_dashboard_stats():
    total_citizens = citizens_collection.count_documents({})
    total_officers = police_collection.count_documents({})
    suspended_officers = police_collection.count_documents({"status": "suspended"})

    return {
        "total_citizens": total_citizens,
        "total_officers": total_officers,
        "suspended_officers": suspended_officers
    }

# ─── GET /admin/get-citizens ──────────────────────────────────────────────────
@app.get("/admin/get-citizens")
def get_citizens():
    users = [serialize_user(u) for u in citizens_collection.find()]
    return {"users": users}


# ─── GET /admin/get-police ────────────────────────────────────────────────────
@app.get("/admin/get-police")
def get_police():
    users = []
    for u in police_collection.find():
        u["_id"] = str(u["_id"])
        u["full_name"] = u.get("name") or "Unknown"  # ✅ officers use "name"
        
        # ✅ Handle "Available" (capital A) → "active"
        db_status = u.get("status", "Available")
        if db_status.lower() in ("available", "active"):
            u["status"] = "active"
        else:
            u["status"] = "suspended"
        
        users.append(u)
    return {"users": users}

# ─── DELETE /admin/delete-user/{email}/{role} ─────────────────────────────────
@app.delete("/admin/delete-user/{email}/{role}")
def delete_user(email: str, role: str):
    collection = citizens_collection if role == "citizen" else police_collection
    result = collection.delete_one({"email": email})
    if result.deleted_count == 0:
        return {"error": "User not found."}
    return {"message": f"User '{email}' deleted successfully."}


# ─── POST /admin/update-user-status ──────────────────────────────────────────
class StatusUpdateRequest(BaseModel):
    email: str
    role: str
    status: str  # "active" or "suspended"

@app.post("/admin/update-user-status")
def update_user_status(body: StatusUpdateRequest):
    if body.status not in ("active", "suspended"):
        raise HTTPException(status_code=400, detail="Invalid status value.")

    collection = citizens_collection if body.role == "citizen" else police_collection
    
    # For officers, save "Available" instead of "active" to match DB format
    db_status = "Available" if (body.role == "police" and body.status == "active") else body.status
    
    result = collection.update_one(
        {"email": body.email},
        {"$set": {"status": db_status}}
    )
    if result.matched_count == 0:
        return {"error": "User not found."}

    # ✅ Also update status in police_login so suspended officers can't log in
    if body.role == "police":
        db["police_login"].update_one(
            {"email": body.email},
            {"$set": {"status": body.status}}  # saves "suspended" or "active"
        )

    return {"message": f"User '{body.email}' status updated to '{body.status}'."}
