from fastapi import FastAPI
from pydantic import BaseModel, field_validator, EmailStr
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
from dotenv import load_dotenv
import re
import os
from datetime import datetime
import traceback
import datetime
import uuid

# Load environment variables
load_dotenv()
GEMINI_API_KEY = "AIzaSyBtdtsW9JfWFZfHXvwXF-Yh2qjPZ8Xh-uY"

# Configure Gemini
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-2.0-flash")

# Initialize FastAPI app
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow React frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create a unique FIR ID using date + short UUID
def generate_fir_id(location: str):
    now = datetime.datetime.now()
    date_str = now.strftime("%Y-%m-%d")
    unique_suffix = str(uuid.uuid4())[:8].upper()  # short random unique part
    location_code = location[:3].upper() if location else "GEN"
    return f"FIR-{location_code}-{date_str}-{unique_suffix}"

# Pydantic model for FIR form data
class FIRRequest(BaseModel):
    full_name: str
    cnic: str
    email: EmailStr
    phone: str
    crime_category: str
    location: str
    date_of_incident: str
    suspect_info: str
    citizen_narrative: str

    # CNIC validation
    @field_validator("cnic")
    def validate_cnic(cls, v):
        pattern = r"^\d{5}-\d{7}-\d$"
        if not re.match(pattern, v):
            raise ValueError("Invalid CNIC format. Use #####-#######-# format (e.g., 35202-1234567-1).")
        return v

    # Phone number validation
    @field_validator("phone")
    def validate_phone(cls, v):
        pattern = r"^03\d{2}-?\d{7}$"
        if not re.match(pattern, v):
            raise ValueError("Invalid phone number format. Use 03XX-XXXXXXX (e.g., 0301-2345678).")
        return v

    # Date validation
    @field_validator("date_of_incident")
    def validate_date(cls, v):
        try:
            datetime.strptime(v, "%Y-%m-%d")
        except ValueError:
            raise ValueError("Invalid date format. Use YYYY-MM-DD format (e.g., 2025-10-25).")
        return v


@app.post("/generate-description")
async def generate_description(data: FIRRequest):
    # Build a clear prompt for Gemini
    prompt = f"""
    You are an assistant generating an official "Description of Incident" for a First Information Report (FIR) in Pakistan.

    Below is the information provided by the citizen:

    Full Name: {data.full_name}
    CNIC: {data.cnic}
    Email: {data.email}
    Phone: {data.phone}
    Crime Category: {data.crime_category}
    Location: {data.location}
    Date of Incident: {data.date_of_incident}
    Suspect Information: {data.suspect_info}
    Citizen's Statement: {data.citizen_narrative}

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

    Now generate the complete and detailed description based on the above information.
    """


    try:
        response = model.generate_content(prompt)
        description = response.text.strip() if response and response.text else "No response from Gemini."
        return {"description": description}

    except Exception as e:
        print(" Gemini Error:", e)
        traceback.print_exc()
        return {"error": str(e), "description": "Error: Could not get a response from Gemini AI."}
    
@app.post("/submit-fir")
async def submit_fir(data: FIRRequest):
    # Generate a unique FIR ID
    fir_id = generate_fir_id(data.location)

    # In a real app, you’d save this FIR to your database here.
    return {
        "message": "FIR submitted successfully.",
        "reference_id": fir_id,
        "citizen": data.full_name,
        "crime_category": data.crime_category,
        "location": data.location,
    }

