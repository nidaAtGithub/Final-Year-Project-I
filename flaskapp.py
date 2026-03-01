from fastapi import FastAPI, UploadFile, File, Form
from pydantic import BaseModel, field_validator, EmailStr
from fastapi.middleware.cors import CORSMiddleware
from notification import send_fir_submission_email
import re
import os
from datetime import datetime 
import traceback
import uuid
from pymongo import MongoClient
from typing import Optional, List
import requests
from cryptography.fernet import Fernet
import json
from dotenv import load_dotenv
import os

load_dotenv()
from web3 import Web3
import json


# -----------------------------
# Load environment variables
# -----------------------------

#load_dotenv()
#GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyBtdtsW9JfWFZfHXvwXF-Yh2qjPZ8Xh-uY")

# -----------------------------
# MongoDB setup
# -----------------------------
client = MongoClient("mongodb+srv://nida_azam:weirdo21!@fircluster.a71bcu6.mongodb.net/?appName=FIRCluster")
#mongodb+srv://nida_azam:weirdo21!@fircluster.a71bcu6.mongodb.net/?appName=FIRCluster
db = client["fir_db"]
firs_collection = db["firs"]

# -----------------------------
# Configure Gemini
# -----------------------------
#genai.configure(api_key=GEMINI_API_KEY)
#model = genai.GenerativeModel("gemini-2.0-flash")

# -----------------------------
# FastAPI setup
# -----------------------------
app = FastAPI()
app.add_middleware(
    CORSMiddleware, 
    allow_origins=["*"], 
    allow_credentials=True, 
    allow_methods=["*"], 
    allow_headers=["*"])


# Connect to Hardhat local blockchain
w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:8545"))

if not w3.is_connected():
    print("Blockchain not connected")
else:
    print("Blockchain connected")

# Load ABI (based on your actual contract file name)
with open("artifacts/contracts/solidity.sol/FIRRegistry.json") as f:
    contract_json = json.load(f)
    contract_abi = contract_json["abi"]

contract_address = os.getenv("CONTRACT_ADDRESS")

checksum_address = w3.to_checksum_address(contract_address)

contract = w3.eth.contract(
    address=checksum_address,
    abi=contract_abi
)

# -----------------------------
# IPFS Upload (Pinata)
# -----------------------------
PINATA_JWT = os.getenv("JWT_KEY")

def upload_to_ipfs(data: dict) -> str:
    url = "https://api.pinata.cloud/pinning/pinJSONToIPFS"

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {PINATA_JWT.strip()}",
    }

    response = requests.post(url, json=data, headers=headers)

    print("Status Code:", response.status_code)
    print("Full Response:", response.text)

    if response.status_code != 200:
        raise Exception(f"IPFS upload failed: {response.text}")

    ipfs_hash = response.json()["IpfsHash"]

    print("Generated IPFS Hash:", ipfs_hash)  # 👈 ADD THIS

    return ipfs_hash
# ----------------------------
#      Upload Evidence
# ----------------------------

def upload_file_to_ipfs(file: UploadFile) -> str:
    url = "https://api.pinata.cloud/pinning/pinFileToIPFS"

    headers = {
        "Authorization": f"Bearer {PINATA_JWT.strip()}"
    }

    files = {
    "file": (file.filename, file.file, file.content_type)
    }

    response = requests.post(url, files=files, headers=headers)

    if response.status_code != 200:
        raise Exception(f"Evidence upload failed: {response.text}")

    return response.json()["IpfsHash"]
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
    phone: str
    email: EmailStr
    crime_category: str
    location: str
    date_of_incident: str
    time_of_incident: Optional[str] = None
    citizen_narrative: Optional[str] = None
    suspect_info: Optional[str] = None
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
    - Date, time, and location of the incident within the description
    - Nature and category of the crime
    - Actions or behavior of the suspect(s)
    - Impact on the victim (if any)
    - Any property, evidence, or witnesses mentioned
    - Avoid redundancy, speculation, or emotional wording.
    - Do **not** include placeholders, options, or meta comments.
    - The paragraph must be **self-contained, coherent, and ready for official documentation**.

    Now generate the complete and detailed description based on the above information in (7-10) sentences.
    Only include the information added in the form.

    IMPORTANT:
    - Output ONLY the final FIR description paragraph.
]    - Do NOT include phrases like:
    "Here is the generated description"
    "Please let me know if you need modifications"
    - Return only the formal paragraph text.
    """

    try:
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
            "model": "llama3:8b",
            "prompt": prompt,
            "stream": False,
            "options": {
                "num_predict": 300
            }
        }

        )

        result = response.json()
        description = result.get("response", "No response from Ollama.")

        return {"description": description.strip()}

    except Exception as e:
        print("Ollama Error:", e)
        traceback.print_exc()
        return {
            "error": str(e),
            "description": "Error: Could not get response from Ollama."
        }


# -----------------------------
# Route: Submit FIR (Save All Fields)
# -----------------------------
@app.post("/submit-fir")
async def submit_fir(
    full_name: str = Form(...),
    cnic: str = Form(...),
    phone: str = Form(...),
    email: str = Form(...),
    crime_category: str = Form(...),
    location: str = Form(...),
    date_of_incident: str = Form(...),
    time_of_incident: str = Form(None),
    citizen_narrative: str = Form(None),
    suspect_info: str = Form(None),
    incident_description: str = Form(...),
    evidence: List[UploadFile] = File(None),
):

    fir_id = generate_fir_id(location)
    fir_payload = {
        "reference_id": fir_id,
        "full_name": full_name,
        "cnic": cnic,
        "phone": phone,
        "email": email,
        "crime_category": crime_category,
        "location": location,
        "date_of_incident": date_of_incident,
        "time_of_incident": time_of_incident,
        "citizen_narrative": citizen_narrative,
        "suspect_info": suspect_info,
        "incident_description": incident_description,
        "created_at": datetime.utcnow().isoformat()
    }
    #Upload Evidence Files
    evidence_cids = []

    if evidence:
        for file in evidence:
            cid = upload_file_to_ipfs(file)
            evidence_cids.append(cid)

    fir_payload["evidence_cids"] = evidence_cids

    
    #Encrypt FIR (WITHOUT modifying Mongo copy)
    encrypted_data = encrypt_fir_data(fir_payload)


    # Upload Encrypted FIR JSON to IPFS
    ipfs_hash = upload_to_ipfs(encrypted_data)

    #Store CID on Blockchain
    private_key = os.getenv("PRIVATE_KEY")
    account = w3.eth.account.from_key(private_key)
    nonce = w3.eth.get_transaction_count(account.address)

    #Store Plain FIR in MongoDB
    firs_collection.insert_one(fir_payload)

    tx = contract.functions.submitFIR(
    fir_id,
    ipfs_hash,
    evidence_cids
    ).build_transaction({
        "chainId": 31337,
        "from": account.address,
        "nonce": nonce,
        "gas": 3000000,
        "gasPrice": w3.to_wei("1", "gwei"),
    })

    signed_tx = account.sign_transaction(tx)
    tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)
    receipt = w3.eth.wait_for_transaction_receipt(tx_hash)

    return {
        "message": "FIR + Evidence stored successfully",
        "reference_id": fir_id,
        "block_number": receipt.blockNumber,
        "transaction_hash": tx_hash.hex(),
        "ipfs_hash": ipfs_hash,
        "evidence_cids": evidence_cids
    } 
#-------------------------------
#          Encryption
#-------------------------------

FERNET_KEY = os.getenv("FERNET_KEY")
cipher = Fernet(FERNET_KEY.encode())
def encrypt_fir_data(data):
    json_data = json.dumps(data)
    encrypted = cipher.encrypt(json_data.encode())
    return {"encrypted_data": encrypted.decode()}

# ----------------------------
#     Save As Draft
# ----------------------------
@app.post("/save-draft")
async def save_draft(
    full_name: str = Form(None),
    cnic: str = Form(None),
    phone: str = Form(None),
    email: str = Form(...),
    crime_category: str = Form(None),
    location: str = Form(None),
    date_of_incident: str = Form(None),
    time_of_incident: str = Form(None),
    citizen_narrative: str = Form(None),
    suspect_info: str = Form(None),
    incident_description: str = Form(None),
):
    draft_id = f"DRAFT-{uuid.uuid4().hex[:8].upper()}"

    draft_data = {
        "reference_id": draft_id,
        "full_name": full_name,
        "cnic": cnic,
        "phone": phone,
        "email": email,
        "crime_category": crime_category,
        "location": location,
        "date_of_incident": date_of_incident,
        "time_of_incident": time_of_incident,
        "citizen_narrative": citizen_narrative,
        "suspect_info": suspect_info,
        "incident_description": incident_description,
        "status": "draft",
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    }

    firs_collection.insert_one(draft_data)

    return {
        "message": "Draft saved successfully",
        "reference_id": draft_id
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
async def get_firs(email: str):
    firs = list(
        firs_collection.find(
            {"email": email},   #Filter by mail
            {"_id": 0, "reference_id": 1, "crime_category": 1, "location": 1, "created_at": 1}
        )
    )

    for fir in firs:
        if "created_at" in fir and isinstance(fir["created_at"], datetime):
            fir["created_at"] = fir["created_at"].isoformat()

    return {"firs": firs}