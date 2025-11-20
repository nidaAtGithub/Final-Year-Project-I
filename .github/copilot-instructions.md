# AI Coding Agent Instructions - FIRLedger

## Project Overview

**FIRLedger** is an **Automated FIR (First Information Report) System** designed to modernize crime reporting in Pakistan through blockchain immutability, AI-powered assistance, and transparent role-based dashboards.

**Core Problem Solved:** Current FIR registration is manual, slow, prone to corruption/bias, lacks transparency, and leaves citizens with no visibility into case progress.

**Key Solution:** Blockchain for immutable audit trails + AI for intelligent FIR drafting + Transparent dashboards for citizens, police, and admins.

## Full Tech Stack

**Frontend:** React + TypeScript + Vite (Frontends branch - currently incomplete on GitHub)  
**Backend:** FastAPI (Python) - Main implementation in Backend/main branch  
**Database:** MongoDB Atlas (cloud)  
**Blockchain:** Hyperledger Fabric or Ethereum testnet (hashes/metadata only, off-chain storage via IPFS)  
**AI/ML:** Google Gemini 2.0-flash (chatbot), Gemini 2.5-pro (audio), NLP for legal section mapping  
**Storage:** IPFS (for evidence files)  
**Authentication:** CNIC validation + OTP/Multi-factor auth  
**Communication:** SMS/Email via third-party services

## System Architecture (17 Core Modules)

### User Roles & Dashboards
1. **Citizen Dashboard** - File FIR, track status, upload evidence, receive notifications
2. **Police Dashboard** - Review/approve FIRs, update status, assign cases, view analytics
3. **Admin Dashboard** - Manage users/roles, view blockchain logs, generate reports, configure system

### Core FIR Workflow
1. **FIR Registration** - Form-based or natural language (text/voice) input via NLP
2. **FIR Verification** - Police officer review → approve/reject → blockchain storage
3. **Status Updates** - Each police action creates immutable blockchain transaction
4. **Search & Retrieval** - By FIR #, CNIC, blockchain transaction ID
5. **Evidence Upload** - Secure IPFS storage with blockchain hash verification
6. **Status Timeline** - Visual representation of FIR lifecycle for citizen transparency

### AI & Intelligence
- **AI Chatbot** (Module 7) - 24/7 support for FIR guidance + legal FAQs
- **Legal Section Recommendation** (Module 10) - NLP maps narrative to Pakistan Penal Code sections
- **Duplication/Fraud Detection** (Module 17) - Text similarity, metadata matching, IP/device tracking

### Advanced Features
- **Escalation Smart Contract** - Auto-escalate to senior officers if no action in 72 hours
- **Notifications** (SMS/Email) - Real-time alerts on approval, rejection, status changes
- **Multi-language** - Urdu + English interface
- **Role & Permission Management** - Granular access control per role
- **Admin Reporting & Analytics** - Region/crime-type statistics, officer performance metrics

## Quick Setup - Backend Only

```powershell
cd "d:\Semester 7\FYP\Final-Year-Project-I"
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install fastapi uvicorn google-generativeai pymongo python-dotenv pydantic[email]
choco install ffmpeg  # or manual install
uvicorn flaskapp:app --reload --port 8000
```

Visit: `http://localhost:8000`

## Backend File Structure & Responsibilities

- **`main.py`** - Minimal entry point; imports chatbot router
- **`flaskapp.py`** - Core FastAPI app:
  - POST `/generate-description` - Gemini generates FIR description from form data
  - POST `/submit-fir` - Saves complete FIR to MongoDB
  - GET `/get-firs` - Returns summary list of all FIRs
  - GET `/get-fir-details/{reference_id}` - Retrieves specific FIR
- **`chatbot.py`** - Legal chatbot router:
  - POST `/chatbot/` - Answers PPC questions, FIR filing guidance
  - System prompt specializes Gemini for Pakistan legal context
  - 20-second timeout for response generation
- **`audio.py`** - Voice-to-text pipeline:
  - POST `/transcribe-audio` - Converts WebM → WAV → Gemini transcription
  - Returns structured FIR template with narrative field filled
  - Max 10-second audio duration

## Data Models & Validation

**FIRRequest** (flaskapp.py) - Comprehensive form validation:
- CNIC: `\d{5}-\d{7}-\d` (e.g., 12345-1234567-8)
- Phone: `03XX-XXXXXXX` (e.g., 0321-1234567)
- Date: `YYYY-MM-DD`
- Email: RFC5321 standard
- Fields: full_name, crime_category, location, date_of_incident, time_of_incident, suspect_info, citizen_narrative, incident_description

**ChatRequest** (chatbot.py) - Simple: `{"message": "string"}`

**FIR ID Generation:** `FIR-{LOCATION_CODE}-{DATE}-{UUID_8}`  
Example: `FIR-ISL-2025-01-19-A7F3D2B1`

## Development Patterns

### Adding New FIR Routes
```python
from pydantic import BaseModel, field_validator

class MyRequest(BaseModel):
    field_name: str
    
    @field_validator('field_name')
    def validate_field(cls, v):
        if not condition:
            raise ValueError('message')
        return v

@app.post('/my-endpoint')
async def my_function(data: MyRequest):
    try:
        # Process
        firs_collection.insert_one(data.model_dump())
        return {"status": "success", "data": {...}}
    except Exception as e:
        return {"error": str(e)}
```

### Gemini Integration Patterns
```python
import google.generativeai as genai

# Text generation
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-2.0-flash")
response = model.generate_content(prompt)
result = response.text.strip()

# Audio transcription (audio.py)
uploaded = genai.upload_file(wav_path)
response = model.generate_content([prompt, uploaded])
```

### MongoDB Best Practices
- Always exclude `_id` from responses: `find({}, {"_id": 0})`
- Use `model.model_dump()` to convert Pydantic → dict
- Convert datetime to ISO: `datetime.utcnow().isoformat()`
- Log all database operations for audit trail

## System Requirements (Non-Functional)

- **Performance:** 500 concurrent users, FIR search < 3 seconds
- **Availability:** 99.9% uptime with automatic failover
- **Security:** CNIC validation, MFA, role-based access control, blockchain immutability
- **Scalability:** Horizontal scaling for MongoDB + blockchain nodes
- **Auditability:** All actions logged with timestamp, user ID, action details

## Testing Workflow

```bash
# Start dev server
uvicorn flaskapp:app --reload

# Test endpoints with curl or Postman
curl -X POST http://localhost:8000/generate-description \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "John Doe",
    "cnic": "12345-1234567-8",
    "email": "john@example.com",
    "phone": "0321-1234567",
    "crime_category": "Theft",
    "location": "Islamabad",
    "date_of_incident": "2025-01-19",
    "citizen_narrative": "My car was stolen..."
  }'
```

## Common Pitfalls & Solutions

| Issue | Solution |
|-------|----------|
| ffmpeg not found | Install via `choco install ffmpeg` or manually, add to PATH |
| Gemini API errors | Verify API key validity; check rate limits |
| MongoDB auth fails | Whitelist your IP in Atlas dashboard |
| Audio > 10s | ffprobe duration check enforced; trim or re-record |
| CNIC validation fails | Check format: `#####-#######-#` exactly |
| Chatbot timeout | 20s limit; complex queries need fallback to human |
| Blockchain transaction fails | System retries automatically; check network connectivity |

## Security Issues to Address

1. **Hardcoded Credentials:** Move Gemini API key + MongoDB connection to `.env`
2. **CORS:** Change from `["*"]` to specific frontend origin in production
3. **Plain Text Passwords:** Currently no auth implemented; add JWT + password hashing
4. **Rate Limiting:** No API rate limits; add before production
5. **Logging:** Currently print/traceback only; implement proper logging library
6. **Input Sanitization:** Validate all Gemini-generated outputs for injection attacks

## Frontend Integration Points (When Ready)

The React frontend should call these endpoints:
- **`POST /generate-description`** - Auto-fill FIR narrative field
- **`POST /submit-fir`** - Final FIR submission
- **`GET /get-firs`** - Dashboard FIR list
- **`POST /chatbot/`** - Chatbot widget
- **`POST /transcribe-audio`** - Voice recording to text

All responses are JSON; handle 400/500 errors gracefully.

## Blockchain Integration Notes

Current implementation: **Metadata & hash stored on blockchain, full records in MongoDB**
- FIR hash computed on approval
- Timestamp + metadata immutable on blockchain
- Evidence hashes on IPFS/blockchain
- Smart contract for 72-hour escalation

Future: Integrate actual Hyperledger Fabric or Ethereum testnet endpoints

## Recommended Next Steps

1. ✅ **Current:** Backend running locally
2. 🔨 **Next:** Fix Frontends branch + get React UI running
3. 📝 **Then:** Connect frontend to backend APIs
4. 🔐 **Security:** Implement JWT auth + move credentials to `.env`
5. 📊 **Testing:** Add unit tests + integration tests
6. 🚀 **Deployment:** Docker setup + cloud deployment
