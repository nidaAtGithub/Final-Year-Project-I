# track_status.py — run on port 8009

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from dotenv import load_dotenv
import certifi, os

load_dotenv()

client = MongoClient(os.getenv("MONGO_URI"), tlsCAFile=certifi.where())
db = client["fir_db"]
firs_collection = db["firs"]

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# ✅ Get all FIRs by citizen email with full details
@app.get("/track-firs/{email}")
async def track_firs(email: str):
    firs = list(firs_collection.find(
        {"email": email, "status": {"$ne": "draft"}},
        {"_id": 0}
    ).sort("created_at", -1))
    return {"firs": firs}