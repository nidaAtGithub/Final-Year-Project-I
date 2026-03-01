from fastapi import FastAPI, APIRouter
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import httpx
import traceback

app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

router = APIRouter(prefix="/chatbot", tags=["Chatbot"])

class ChatRequest(BaseModel):
    message: str

# Ollama configuration
OLLAMA_URL = "http://127.0.0.1:11434/api/generate"
MODEL_NAME = "llama3:8b"  

@router.post("/")
async def chat(data: ChatRequest):
    user_message = data.message.strip()
    if not user_message:
        return {"error": "Message cannot be empty."}

    system_prompt = """
    You are an expert on the Pakistan Penal Code (PPC) and official police procedures for filing FIRs.
    Answer the user's questions directly and precisely.
    - For legal questions, give only the relevant PPC sections and their description.
    - For FIR-related questions, explain clearly how to file an FIR, what information/documents are required, and the step-by-step process.
    - Use a formal and factual tone suitable for official guidance.
    - Even answer the basic question about FIR.

    Only answer questions related to Pakistan's FIR system and PPC.
"""

    try:
        async def generate_response():
            async with httpx.AsyncClient() as client:
                payload = {
                    "model": MODEL_NAME,
                    "prompt": f"{system_prompt}\n\nUser: {user_message}",
                    "stream": False,
                    "options": {
                        "temperature": 0.6,
                        "num_predict": 512
                    }
                }

                response = await client.post(OLLAMA_URL, json=payload, timeout=300)
                response.raise_for_status()
                return response.json()

        # Run Ollama request with timeout
        response = await asyncio.wait_for(generate_response(), timeout=300)
        bot_response = response.get("response", "No response from Ollama.")
        return {"response": bot_response}

    except asyncio.TimeoutError:
        return {
            "response": "The request took too long (over 130 seconds). Please try again later."
        }

    except httpx.ConnectError as e:
        print(f"[ERROR] Connection Error: {e}")
        return {
            "response": "Error: Cannot connect to Ollama service. Make sure Ollama is running on http://127.0.0.1:11434"
        }

    except Exception as e:
        print(f"[ERROR] Ollama Error: {e}")
        traceback.print_exc()
        return {
            "response": "Error: Could not get a response from Ollama.",
            "error": str(e)
        }

app.include_router(router)
