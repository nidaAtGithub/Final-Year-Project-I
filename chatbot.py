from fastapi import FastAPI, APIRouter
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from google import genai
import asyncio
import traceback

app = FastAPI()

#CORS setup
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

# Initialize Gemini client
client = genai.Client(api_key="AIzaSyBtdtsW9JfWFZfHXvwXF-Yh2qjPZ8Xh-uY")


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
        # Timeout wrapper (10 seconds)
        async def generate_response():
            response = client.models.generate_content(
                model="gemini-2.0-flash",
                contents=[f"{system_prompt}\n\nUser: {user_message}"],
                config={
                    "temperature": 0.6,
                    "max_output_tokens": 8192
                }
            )
            return response

        # Run with timeout
        response = await asyncio.wait_for(generate_response(), timeout=20)

        bot_response = response.text or "No response from Gemini."
        return {"response": bot_response}

    except asyncio.TimeoutError:
        return {
            "response": "he request took too long (over 10 seconds). Please try again later."
        }

    except Exception as e:
        print("Gemini Error:", e)
        traceback.print_exc()
        return {
            "response": "Error: Could not get a response from Gemini AI.",
            "error": str(e)
        }


app.include_router(router)
