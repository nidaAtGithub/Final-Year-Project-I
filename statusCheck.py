# notifications.py — run on port 8007

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pymongo import MongoClient
from dotenv import load_dotenv
from datetime import datetime
import certifi, os

load_dotenv()

client = MongoClient(os.getenv("MONGO_URI"), tlsCAFile=certifi.where())
db = client["fir_db"]
notifications_collection = db["notifications"]
firs_collection = db["firs"]

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# ─── Models ───────────────────────────────────────────────────────────────────
class NotificationRequest(BaseModel):
    email: str
    fir_id: str
    title: str
    message: str
    status: str  # submitted, assigned, under_review, resolved, rejected

# ─── POST: Create a notification ─────────────────────────────────────────────
@app.post("/statusCheck/create")
async def create_notification(data: NotificationRequest):
    notifications_collection.insert_one({
        "email": data.email,
        "fir_id": data.fir_id,
        "title": data.title,
        "message": data.message,
        "status": data.status,
        "read": False,
        "created_at": datetime.utcnow().isoformat()
    })
    return {"message": "Notification created"}

# ─── POST: Mark all as read ───────────────────────────────────────────────────
@app.post("/statusCheck/mark-read/{email}")
async def mark_all_read(email: str):
    notifications_collection.update_many(
        {"email": email, "read": False},
        {"$set": {"read": True}}
    )
    return {"message": "All marked as read"}

# ─── POST: Mark single notification as read ───────────────────────────────────
@app.post("/statusCheck/mark-one-read/{email}/{fir_id}")
async def mark_one_read(email: str, fir_id: str):
    notifications_collection.update_one(
        {"email": email, "fir_id": fir_id, "read": False},
        {"$set": {"read": True}}
    )
    return {"message": "Notification marked as read"}

# ─── DELETE: Clear all notifications for a citizen ────────────────────────────
@app.delete("/statusCheck/clear/{email}")
async def clear_notifications(email: str):
    notifications_collection.delete_many({"email": email})
    return {"message": "All notifications cleared"}

# ─── GET: Get all notifications for a citizen ─────────────────────────────────
@app.get("/statusCheck/{email}")
async def get_notifications(email: str):
    notifs = list(notifications_collection.find(
        {"email": email},
        {"_id": 0}
    ).sort("created_at", -1))
    unread_count = notifications_collection.count_documents({"email": email, "read": False})
    return {"notifications": notifs, "unread_count": unread_count}
