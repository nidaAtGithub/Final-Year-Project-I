from fastapi import FastAPI, UploadFile, File, Form
from pydantic import BaseModel, field_validator, EmailStr
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
from dotenv import load_dotenv
import re
import os
from datetime import datetime 
import traceback
import uuid
from pymongo import MongoClient
from typing import Optional

# -----------------------------
# Load environment variables
# -----------------------------
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyBtdtsW9JfWFZfHXvwXF-Yh2qjPZ8Xh-uY")

# -----------------------------
# MongoDB setup
# -----------------------------
client = MongoClient("mongodb+srv://nida_azam:weirdo21!@fircluster.a71bcu6.mongodb.net/?appName=FIRCluster")
db = client["fir_db"]
firs_collection = db["firs"]

# -----------------------------
# Configure Gemini
# -----------------------------
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-2.0-flash")

# -----------------------------
# FastAPI setup
# -----------------------------
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # React frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# Utility: Generate unique FIR ID
# -----------------------------
def generate_fir_id(location: str):
    now = datetime.now()
    date_str = now.strftime("%Y-%m-%d")
    unique_suffix = str(uuid.uuid4())[:8].upper()
    location_code = location[:3].upper() if location else "GEN"
    return f"FIR-{location_code}-{date_str}-{unique_suffix}"

# -----------------------------
# Model: FIR form data
# -----------------------------

class FIRRequest(BaseModel):
    full_name: str
    cnic: str
    email: EmailStr
    phone: str
    crime_category: str
    location: str
    date_of_incident: str
    time_of_incident: Optional[str] = None
    suspect_info: Optional[str] = None
    citizen_narrative: Optional[str] = None
    incident_description: Optional[str] = None

    # CNIC validation
    @field_validator("cnic")
    def validate_cnic(cls, v):
        pattern = r"^\d{5}-\d{7}-\d$"
        if not re.match(pattern, v):
            raise ValueError("Invalid CNIC format. Use #####-#######-# format.")
        return v

    # Phone validation
    @field_validator("phone")
    def validate_phone(cls, v):
        pattern = r"^03\d{2}-?\d{7}$"
        if not re.match(pattern, v):
            raise ValueError("Invalid phone number. Use 03XX-XXXXXXX format.")
        return v

    # Date validation
    @field_validator("date_of_incident")
    def validate_date(cls, v):
        try:
            datetime.strptime(v, "%Y-%m-%d")
        except ValueError:
            raise ValueError("Invalid date format. Use YYYY-MM-DD.")
        return v


# -----------------------------
# Route: Generate AI Description
# -----------------------------
@app.post("/generate-description")
async def generate_description(data: FIRRequest):
    prompt = f"""
    You are an assistant generating an official "Description of Incident" for a First Information Report (FIR) in Pakistan.

    Below is the citizen-provided data:
    Full Name: {data.full_name}
    CNIC: {data.cnic}
    Email: {data.email}
    Phone: {data.phone}
    Crime Category: {data.crime_category}
    Location: {data.location}
    Date: {data.date_of_incident}
    Time: {data.time_of_incident}
    Suspect Info: {data.suspect_info}
    Citizen Narrative: {data.citizen_narrative}

    Write a detailed, factual, and formal paragraph suitable for inclusion in an FIR report.

    Guidelines:
    - The description should be **around 7–10 sentences**, providing a clear sequence of events.
    - Maintain a **neutral, professional, and legal tone** (as used in police reports in Pakistan).
    - Include key elements:
    - Date, time, and location of the incident
    - Nature and category of the crime
    - Actions or behavior of the suspect(s)
    - Impact on the victim (if any)
    - Any property, evidence, or witnesses mentioned
    - Avoid redundancy, speculation, or emotional wording.
    - Do **not** include placeholders, options, or meta comments.
    - The paragraph must be **self-contained, coherent, and ready for official documentation**.

    Now generate the complete and detailed description based on the above information in (7-10) sentences.
    Only include the information added in the form.
    """

    try:
        response = model.generate_content(prompt)
        description = response.text.strip() if response and response.text else "No response from Gemini."
        return {"description": description}
    except Exception as e:
        print("Gemini Error:", e)
        traceback.print_exc()
        return {"error": str(e), "description": "Error: Could not get a response from Gemini AI."}


# -----------------------------
# Route: Submit FIR (Save All Fields)
# -----------------------------
@app.post("/submit-fir")
async def submit_fir(data: FIRRequest):
    fir_id = generate_fir_id(data.location)

    fir_document = data.model_dump()
    fir_document["reference_id"] = fir_id
    fir_document["created_at"] = datetime.utcnow()

    print("Inserted FIR Description:\n", fir_document.get("incident_description", "No Description Provided"))

    result = firs_collection.insert_one(fir_document)

    return {
        "message": "FIR submitted successfully and stored in MongoDB.",
        "reference_id": fir_id,
        "inserted_id": str(result.inserted_id),
        "citizen": data.full_name,
        "crime_category": data.crime_category,
        "location": data.location,
    }



# -----------------------------
# Route: Retrieve Single FIR Details
# -----------------------------
@app.get("/get-fir-details/{reference_id}")
async def get_fir_details(reference_id: str):
    fir = firs_collection.find_one({"reference_id": reference_id}, {"_id": 0})
    if not fir:
        return {"error": "FIR not found"}
    return {"fir": fir}


# -----------------------------
# Route: Retrieve All FIRs (summary list)
# -----------------------------
@app.get("/get-firs")
async def get_firs():
    firs = list(firs_collection.find(
        {},
        {"_id": 0, "reference_id": 1, "crime_category": 1, "location": 1, "created_at": 1}
    ))

    for fir in firs:
        if "created_at" in fir and isinstance(fir["created_at"], datetime):
            fir["created_at"] = fir["created_at"].isoformat()

    return {"firs": firs}
