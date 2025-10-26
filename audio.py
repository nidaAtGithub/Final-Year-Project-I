from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import requests
import json
import subprocess
import tempfile
import re
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

HF_API_KEY = "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"
WHISPER_MODEL = "openai/whisper-large-v3-turbo"
LLM_MODEL = "mistralai/mixtral-8x7b"
HF_HEADERS = {"Authorization": f"Bearer {HF_API_KEY}"}


@app.post("/transcribe-audio")
async def transcribe_audio(file: UploadFile = File(...)):
    audio_bytes = await file.read()

    try:
        # Convert WebM/Opus to WAV
        with tempfile.NamedTemporaryFile(suffix=".webm", delete=False) as tmp_webm:
            tmp_webm.write(audio_bytes)
            tmp_webm.flush()
            webm_path = tmp_webm.name

        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp_wav:
            wav_path = tmp_wav.name

        # ffmpeg conversion
        result = subprocess.run(
            ["ffmpeg", "-i", webm_path, "-ar", "16000", wav_path, "-y"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        
        if result.returncode != 0:
            return {"error": f"Audio conversion failed: {result.stderr.decode()}"}

        # Send WAV to Whisper
        with open(wav_path, "rb") as audio_file:
            response = requests.post(
                f"https://api-inference.huggingface.co/models/{WHISPER_MODEL}",
                headers={
                    "Authorization": f"Bearer {HF_API_KEY}",
                    "Content-Type": "audio/wav"
                },
                data=audio_file.read(),
                timeout=30
            )

        # Clean up temp files
        os.unlink(webm_path)
        os.unlink(wav_path)

        if response.status_code != 200:
            return {"error": f"Whisper API error: {response.text}"}

        whisper_result = response.json()
        audio_text = whisper_result.get("text", "").strip()
        
        if not audio_text:
            return {"error": "No transcription returned from Whisper"}

        print(f"\n{'='*60}")
        print(f"📝 TRANSCRIPTION:\n{audio_text}")
        print(f"{'='*60}\n")

        # Return ONLY transcription for narrative field
        # All other fields will be empty (user fills them manually)
        structured_data = {
            "full_name": "",
            "cnic": "",
            "phone": "",
            "email": "",
            "crime_category": "",
            "location": "",
            "date_of_incident": "",
            "time": "",
            "narrative": audio_text,  # Only this field gets filled
            "suspect_info": ""
        }

        print(f"✅ Narrative field filled with transcription")
        print(f"ℹ️  All other fields left empty for manual input\n")

        return {
            "transcription": audio_text,
            "structured_data": structured_data
        }

    except subprocess.CalledProcessError as e:
        return {"error": f"ffmpeg conversion failed: {e}"}
    except requests.Timeout:
        return {"error": "API request timed out"}
    except Exception as e:
        import traceback
        print(f"❌ Exception:\n{traceback.format_exc()}")
        return {"error": f"Unexpected error: {str(e)}"}