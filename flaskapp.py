from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, field_validator, EmailStr
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
from dotenv import load_dotenv
import re
import os
from datetime import datetime 
import traceback
import uuid
import csv
import io
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
    status: str = "Pending"  # Default status when FIR is submitted

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
# Models: Search & Filter
# -----------------------------
class SearchRequest(BaseModel):
    query: str
    search_type: str  # "fir_id", "cnic", "phone", "suspect", or "keyword"
    page: int = 1
    per_page: int = 10

    @field_validator("search_type")
    def validate_search_type(cls, v):
        if v not in ["fir_id", "cnic", "phone", "suspect", "keyword"]:
            raise ValueError("search_type must be 'fir_id', 'cnic', 'phone', 'suspect', or 'keyword'")
        return v
    
    @field_validator("per_page")
    def validate_per_page(cls, v):
        if v < 1 or v > 100:
            raise ValueError("per_page must be between 1 and 100")
        return v


class FilterRequest(BaseModel):
    status: Optional[str] = None
    location: Optional[str] = None
    crime_category: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    page: int = 1
    per_page: int = 10
    
    @field_validator("per_page")
    def validate_per_page(cls, v):
        if v < 1 or v > 100:
            raise ValueError("per_page must be between 1 and 100")
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


# -----------------------------
# Route: Search FIRs
# -----------------------------
@app.post("/search-firs")
async def search_firs(request: SearchRequest):
    """
    Search FIRs by different criteria:
    - search_type: "fir_id" (exact/fuzzy match), "cnic" (exact), "phone" (exact),
                   "suspect" (keyword in suspect_info), or "keyword" (in narrative/description)
    - page: page number (default 1)
    - per_page: results per page (1-100, default 10)
    """
    try:
        results = []
        
        if request.search_type == "fir_id":
            # Search by FIR ID - exact or fuzzy (contains)
            fir = firs_collection.find_one(
                {"reference_id": {"$regex": request.query.upper(), "$options": "i"}}, 
                {"_id": 0}
            )
            results = [fir] if fir else []
            
        elif request.search_type == "cnic":
            # Search by exact CNIC
            firs = list(firs_collection.find(
                {"cnic": request.query}, 
                {"_id": 0}
            ))
            results = firs
            
        elif request.search_type == "phone":
            # Search by phone number
            firs = list(firs_collection.find(
                {"phone": request.query},
                {"_id": 0}
            ))
            results = firs
            
        elif request.search_type == "suspect":
            # Search in suspect information
            firs = list(firs_collection.find(
                {"suspect_info": {"$regex": request.query, "$options": "i"}},
                {"_id": 0}
            ))
            results = firs
            
        elif request.search_type == "keyword":
            # Search in citizen_narrative, incident_description, and crime_category
            firs = list(firs_collection.find(
                {
                    "$or": [
                        {"citizen_narrative": {"$regex": request.query, "$options": "i"}},
                        {"incident_description": {"$regex": request.query, "$options": "i"}},
                        {"crime_category": {"$regex": request.query, "$options": "i"}}
                    ]
                },
                {"_id": 0}
            ))
            results = firs
        
        # Apply pagination
        total_count = len(results)
        skip = (request.page - 1) * request.per_page
        paginated_results = results[skip:skip + request.per_page]
        
        # Convert datetime objects to ISO format
        for fir in paginated_results:
            if "created_at" in fir and isinstance(fir["created_at"], datetime):
                fir["created_at"] = fir["created_at"].isoformat()
        
        return {
            "success": True,
            "search_type": request.search_type,
            "query": request.query,
            "pagination": {
                "total": total_count,
                "page": request.page,
                "per_page": request.per_page,
                "total_pages": (total_count + request.per_page - 1) // request.per_page
            },
            "count": len(paginated_results),
            "results": paginated_results
        }
        
    except Exception as e:
        print("Search Error:", e)
        traceback.print_exc()
        return {
            "success": False,
            "error": str(e),
            "results": []
        }


# -----------------------------
# Route: Filter FIRs
# -----------------------------
@app.post("/filter-firs")
async def filter_firs(request: FilterRequest):
    """
    Filter FIRs by multiple criteria:
    - status: Filter by FIR status
    - location: Filter by incident location
    - crime_category: Filter by crime type
    - start_date & end_date: Filter by date range (YYYY-MM-DD format)
    - page: page number (default 1)
    - per_page: results per page (1-100, default 10)
    """
    try:
        query = {}
        
        # Add location filter
        if request.location:
            query["location"] = request.location
        
        # Add crime category filter
        if request.crime_category:
            query["crime_category"] = request.crime_category
        
        # Add status filter
        if request.status:
            query["status"] = request.status
        
        # Add date range filter
        if request.start_date or request.end_date:
            query["created_at"] = {}
            if request.start_date:
                try:
                    start_dt = datetime.strptime(request.start_date, "%Y-%m-%d")
                    query["created_at"]["$gte"] = start_dt
                except ValueError:
                    return {
                        "success": False,
                        "error": f"Invalid start_date format. Use YYYY-MM-DD",
                        "results": []
                    }
            if request.end_date:
                try:
                    end_dt = datetime.strptime(request.end_date, "%Y-%m-%d")
                    # Set to end of day
                    end_dt = end_dt.replace(hour=23, minute=59, second=59)
                    query["created_at"]["$lte"] = end_dt
                except ValueError:
                    return {
                        "success": False,
                        "error": f"Invalid end_date format. Use YYYY-MM-DD",
                        "results": []
                    }
        
        # Execute query
        firs = list(firs_collection.find(query, {"_id": 0}))
        
        # Apply pagination
        total_count = len(firs)
        skip = (request.page - 1) * request.per_page
        paginated_firs = firs[skip:skip + request.per_page]
        
        # Convert datetime objects to ISO format
        for fir in paginated_firs:
            if "created_at" in fir and isinstance(fir["created_at"], datetime):
                fir["created_at"] = fir["created_at"].isoformat()
        
        return {
            "success": True,
            "filters_applied": {
                "location": request.location,
                "crime_category": request.crime_category,
                "status": request.status,
                "date_range": f"{request.start_date} to {request.end_date}" if request.start_date or request.end_date else None
            },
            "pagination": {
                "total": total_count,
                "page": request.page,
                "per_page": request.per_page,
                "total_pages": (total_count + request.per_page - 1) // request.per_page
            },
            "count": len(paginated_firs),
            "results": paginated_firs
        }
        
    except Exception as e:
        print("Filter Error:", e)
        traceback.print_exc()
        return {
            "success": False,
            "error": str(e),
            "results": []
        }


# -----------------------------
# Route: Get FIR Statistics
# -----------------------------
@app.get("/fir-stats")
async def get_fir_stats():
    """
    Get statistics/summary of all FIRs:
    - Total number of FIRs
    - Count by crime category
    - Count by location
    - Count by status (if available)
    """
    try:
        # Total FIRs
        total_firs = firs_collection.count_documents({})
        
        # FIRs by crime category
        by_category = list(firs_collection.aggregate([
            {"$group": {"_id": "$crime_category", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}}
        ]))
        
        # FIRs by location
        by_location = list(firs_collection.aggregate([
            {"$group": {"_id": "$location", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}}
        ]))
        
        # FIRs by status (if status field exists)
        by_status = list(firs_collection.aggregate([
            {"$group": {"_id": "$status", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}}
        ]))
        
        return {
            "success": True,
            "total_firs": total_firs,
            "by_crime_category": by_category,
            "by_location": by_location,
            "by_status": by_status
        }
        
    except Exception as e:
        print("Stats Error:", e)
        traceback.print_exc()
        return {
            "success": False,
            "error": str(e),
            "stats": {}
        }


# -----------------------------
# Route: Update FIR Status
# -----------------------------
class UpdateStatusRequest(BaseModel):
    status: str
    notes: Optional[str] = None


@app.put("/update-fir-status/{reference_id}")
async def update_fir_status(reference_id: str, request: UpdateStatusRequest):
    """
    Update the status of an FIR (Police Officer action).
    Status options: Pending, Under Investigation, Charges Filed, Closed
    """
    try:
        # Valid statuses
        valid_statuses = ["Pending", "Under Investigation", "Charges Filed", "Closed", "Rejected"]
        
        if request.status not in valid_statuses:
            return {
                "success": False,
                "error": f"Invalid status. Must be one of: {', '.join(valid_statuses)}"
            }
        
        # Find the FIR
        fir = firs_collection.find_one({"reference_id": reference_id})
        
        if not fir:
            return {
                "success": False,
                "error": f"FIR with reference_id '{reference_id}' not found"
            }
        
        # Update the FIR with new status and timestamp
        update_data = {
            "status": request.status,
            "updated_at": datetime.utcnow()
        }
        
        # Add notes if provided
        if request.notes:
            update_data["status_notes"] = request.notes
        
        result = firs_collection.update_one(
            {"reference_id": reference_id},
            {"$set": update_data}
        )
        
        if result.modified_count > 0:
            return {
                "success": True,
                "message": f"FIR status updated to '{request.status}'",
                "reference_id": reference_id,
                "new_status": request.status,
                "updated_at": datetime.utcnow().isoformat()
            }
        else:
            return {
                "success": False,
                "error": "Failed to update FIR status"
            }
            
    except Exception as e:
        print("Update Status Error:", e)
        traceback.print_exc()
        return {
            "success": False,
            "error": str(e)
        }


# -----------------------------
# Route: Export Search/Filter Results as CSV
# -----------------------------
@app.post("/export-firs-csv")
async def export_firs_csv(request: FilterRequest):
    """
    Export filtered FIR results as CSV file
    Uses same filters as /filter-firs endpoint
    """
    try:
        query = {}
        
        # Apply same filters as filter-firs
        if request.location:
            query["location"] = request.location
        if request.crime_category:
            query["crime_category"] = request.crime_category
        if request.status:
            query["status"] = request.status
        
        if request.start_date or request.end_date:
            query["created_at"] = {}
            if request.start_date:
                start_dt = datetime.strptime(request.start_date, "%Y-%m-%d")
                query["created_at"]["$gte"] = start_dt
            if request.end_date:
                end_dt = datetime.strptime(request.end_date, "%Y-%m-%d")
                end_dt = end_dt.replace(hour=23, minute=59, second=59)
                query["created_at"]["$lte"] = end_dt
        
        # Get all matching FIRs
        firs = list(firs_collection.find(query, {"_id": 0}))
        
        if not firs:
            return {
                "success": False,
                "error": "No FIRs found matching the filters"
            }
        
        # Create CSV in memory
        output = io.StringIO()
        fieldnames = [
            "reference_id", "full_name", "cnic", "email", "phone", 
            "crime_category", "location", "date_of_incident", "time_of_incident",
            "citizen_narrative", "suspect_info", "status", "created_at"
        ]
        
        writer = csv.DictWriter(output, fieldnames=fieldnames)
        writer.writeheader()
        
        for fir in firs:
            row = {field: fir.get(field, "") for field in fieldnames}
            if "created_at" in row and isinstance(row["created_at"], datetime):
                row["created_at"] = row["created_at"].isoformat()
            writer.writerow(row)
        
        output.seek(0)
        
        return StreamingResponse(
            iter([output.getvalue()]),
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=firs_export.csv"}
        )
        
    except ValueError as e:
        return {"success": False, "error": f"Invalid date format: {str(e)}"}
    except Exception as e:
        print("Export Error:", e)
        traceback.print_exc()
        return {"success": False, "error": str(e)}


# -----------------------------
# Route: Create Database Indexes (Performance Optimization)
# -----------------------------
@app.post("/admin/create-indexes")
async def create_indexes():
    """
    Create indexes on frequently searched fields for performance optimization.
    This should be called once during setup.
    """
    try:
        # Create indexes
        firs_collection.create_index("reference_id")
        firs_collection.create_index("cnic")
        firs_collection.create_index("phone")
        firs_collection.create_index("location")
        firs_collection.create_index("crime_category")
        firs_collection.create_index("status")
        firs_collection.create_index("created_at")
        firs_collection.create_index([("citizen_narrative", "text"), ("incident_description", "text")])
        firs_collection.create_index([("suspect_info", "text")])
        
        return {
            "success": True,
            "message": "Database indexes created successfully",
            "indexes": [
                "reference_id",
                "cnic",
                "phone",
                "location",
                "crime_category",
                "status",
                "created_at",
                "citizen_narrative (text)",
                "incident_description (text)",
                "suspect_info (text)"
            ]
        }
        
    except Exception as e:
        print("Index Creation Error:", e)
        traceback.print_exc()
        return {
            "success": False,
            "error": str(e)
        }
