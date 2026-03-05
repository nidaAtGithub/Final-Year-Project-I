from fastapi import FastAPI, UploadFile, File, Form
from pydantic import BaseModel, field_validator, EmailStr
from fastapi.middleware.cors import CORSMiddleware
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from passlib.context import CryptContext
from pymongo import MongoClient
import random
import time
from dotenv import load_dotenv
from datetime import datetime 
import certifi
import bcrypt

from dotenv import load_dotenv
import os

load_dotenv()

client = MongoClient(
    os.getenv("MONGO_URI"),
    tlsCAFile=certifi.where()
)
db = client["fir_db"]
#User Credential storage
users_collection = db["login_users"]
police_collection = db["police_login"]
admin_collection = db["admin_login"]

def hash_password(password: str) -> str:
    safe = password.encode("utf-8")[:72]
    return bcrypt.hashpw(safe, bcrypt.gensalt()).decode("utf-8")

def verify_password(password: str, hashed: str) -> bool:
    safe = password.encode("utf-8")[:72]
    return bcrypt.checkpw(safe, hashed.encode("utf-8"))



app = FastAPI()
app.add_middleware(
    CORSMiddleware, 
    allow_origins=["*"], 
    allow_credentials=True, 
    allow_methods=["*"], 
    allow_headers=["*"])

# Email config
conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("MAIL_USERNAME"),
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD"),
    MAIL_FROM=os.getenv("MAIL_FROM"),
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
)

# Temporary OTP storage (in memory)
otp_store = {}  # { email: { otp: "123456", expires_at: timestamp } }


# Step 1 — Send OTP
@app.post("/send-otp")
async def send_otp(data: dict):
    email = data.get("email")

    # ✅ Check duplicate email before sending OTP
    existing_user = users_collection.find_one({"email": email})
    if existing_user:
        return {"error": "Email already registered"}

    otp = str(random.randint(100000, 999999))
    expires_at = time.time() + 300
    otp_store[email] = {"otp": otp, "expires_at": expires_at}

    message = MessageSchema(
        subject="Your FIR Portal Verification Code",
        recipients=[email],
        body=f"Your OTP is: {otp}\n\nIt expires in 5 minutes.",
        subtype="plain"
    )

    fm = FastMail(conf)
    await fm.send_message(message)
    return {"message": "OTP sent to your email"}

# Step 2 — Verify OTP
@app.post("/verify-otp")
async def verify_otp(data: dict):
    email = data.get("email")
    otp = data.get("otp")

    record = otp_store.get(email)

    if not record:
        return {"error": "No OTP found for this email"}
    if time.time() > record["expires_at"]:
        del otp_store[email]
        return {"error": "OTP expired. Please request a new one"}
    if record["otp"] != otp:
        return {"error": "Invalid OTP"}

    del otp_store[email]  # remove after successful verification
    return {"verified": True}

class UserRegister(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    role: str  # citizen / police / admin
# -----------------------------
# Model: User Registration
# -----------------------------
@app.post("/register")
async def register(user: UserRegister):
    
    # Pick correct collection based on role
    if user.role == "citizen":
        collection = users_collection
    elif user.role == "police":
        collection = police_collection
    elif user.role == "admin":
        collection = admin_collection
    else:
        return {"error": "Invalid role"}

    # Check if email already exists in that collection
    existing_user = collection.find_one({"email": user.email})
    if existing_user:
        return {"error": "Email already registered"}

    hashed_password = hash_password(user.password)

    try:
        collection.insert_one({
            "full_name": user.full_name,
            "email": user.email,
            "password": hashed_password,
            "role": user.role,
            "created_at": datetime.utcnow()
        })
    except Exception as e:
        return {"error": "Failed to save user"}

    return {"message": "Account created successfully"}

# -----------------------------
# Model: User Login
# -----------------------------
class UserLogin(BaseModel):
    email: EmailStr
    password: str
    role: str


@app.post("/login")
async def login(user: UserLogin):

    # Pick correct collection based on role
    if user.role == "citizen":
        collection = users_collection
    elif user.role == "police":
        collection = police_collection
    elif user.role == "admin":
        collection = admin_collection
    else:
        return {"error": "Invalid role"}

    db_user = collection.find_one({"email": user.email})

    if not db_user:
        return {"error": "User not found"}

    if not verify_password(user.password, db_user["password"]):
        return {"error": "Invalid password"}

    return {
        "message": "Login successful",
        "full_name": db_user["full_name"],
        "role": db_user["role"]
    }
