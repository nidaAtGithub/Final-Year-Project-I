""" from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
import tempfile
import subprocess
import os
import traceback

# Initialize FastAPI app
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini
GEMINI_API_KEY = "AIzaSyBtdtsW9JfWFZfHXvwXF-Yh2qjPZ8Xh-uY"
genai.configure(api_key=GEMINI_API_KEY)

# Model for transcription
GEMINI_MODEL = "gemini-2.5-pro"


@app.post("/transcribe-audio")
async def transcribe_audio(file: UploadFile = File(...)):
    audio_bytes = await file.read()

    try:
        # Save input WebM temporarily
        with tempfile.NamedTemporaryFile(suffix=".webm", delete=False) as tmp_webm:
            tmp_webm.write(audio_bytes)
            tmp_webm.flush()
            webm_path = tmp_webm.name

        # Check audio duration (must be <= 12 seconds)
        duration_check = subprocess.run(
            [
                "ffprobe", "-v", "error",
                "-show_entries", "format=duration",
                "-of", "default=noprint_wrappers=1:nokey=1",
                webm_path
            ],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        duration_str = duration_check.stdout.decode().strip()
        duration = float(duration_str) if duration_str else 0.0

        if duration > 10.0:
            os.unlink(webm_path)
            return {
                "error": f"Audio too long ({duration:.1f}s). Please record within 12 seconds."
            }

        # Convert WebM → WAV (16 kHz)
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp_wav:
            wav_path = tmp_wav.name

        result = subprocess.run(
            ["ffmpeg", "-i", webm_path, "-ar", "16000", wav_path, "-y"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        if result.returncode != 0:
            return {"error": f"Audio conversion failed: {result.stderr.decode()}"}

        # Upload WAV to Gemini
        uploaded_audio = genai.upload_file(wav_path)

        # Transcribe using Gemini
        model = genai.GenerativeModel(GEMINI_MODEL)
        prompt = "Transcribe this audio to clear, grammatically correct English text."
        response = model.generate_content([prompt, uploaded_audio])

        #Extract transcription text
        audio_text = response.text.strip() if response and response.text else ""

        # Cleanup temp files
        os.unlink(webm_path)
        os.unlink(wav_path)

        if not audio_text:
            return {"error": "No transcription returned from Gemini."}

        print(f"\n{'='*60}")
        print(f"TRANSCRIPTION:\n{audio_text}")
        print(f"{'='*60}\n")

        # Prepare structured FIR data
        structured_data = {
            "full_name": "",
            "cnic": "",
            "phone": "",
            "email": "",
            "crime_category": "",
            "location": "",
            "date_of_incident": "",
            "time": "",
            "narrative": audio_text,  # Only this is filled
            "suspect_info": ""
        }

        print("Narrative field filled with transcription.")
        print("All other fields left empty for manual input.\n")

        return {
            "transcription": audio_text,
            "structured_data": structured_data
        }

    except Exception as e:
        print(f"Exception:\n{traceback.format_exc()}")
        return {"error": f"Unexpected error: {str(e)}"}

"""

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import tempfile
import subprocess
import os
import traceback
from faster_whisper import WhisperModel

# Initialize FastAPI app
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Whisper model (base is a good tradeoff between speed and accuracy)
WHISPER_MODEL_NAME = "base"
model = WhisperModel(WHISPER_MODEL_NAME)

@app.post("/transcribe-audio")
async def transcribe_audio(file: UploadFile = File(...)):
    audio_bytes = await file.read()

    try:
        # Save input WebM temporarily
        with tempfile.NamedTemporaryFile(suffix=".webm", delete=False) as tmp_webm:
            tmp_webm.write(audio_bytes)
            tmp_webm.flush()
            webm_path = tmp_webm.name

        # Check audio duration (must be <= 12 seconds)
        duration_check = subprocess.run(
            [
                "ffprobe", "-v", "error",
                "-show_entries", "format=duration",
                "-of", "default=noprint_wrappers=1:nokey=1",
                webm_path
            ],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        duration_str = duration_check.stdout.decode().strip()
        duration = float(duration_str) if duration_str else 0.0

        if duration > 12.0:
            os.unlink(webm_path)
            return {
                "error": f"Audio too long ({duration:.1f}s). Please record within 12 seconds."
            }

        # Convert WebM → WAV (16 kHz)
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp_wav:
            wav_path = tmp_wav.name

        result = subprocess.run(
            ["ffmpeg", "-i", webm_path, "-ar", "16000", wav_path, "-y"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        if result.returncode != 0:
            return {"error": f"Audio conversion failed: {result.stderr.decode()}"}

        # Transcribe audio using Whisper
        segments, info = model.transcribe(wav_path)
        audio_text = " ".join([segment.text for segment in segments]).strip()

        # Cleanup temp files
        os.unlink(webm_path)
        os.unlink(wav_path)

        if not audio_text:
            return {"error": "No transcription returned from Whisper."}

        print(f"\n{'='*60}")
        print(f"TRANSCRIPTION:\n{audio_text}")
        print(f"{'='*60}\n")

        # Prepare structured FIR data
        structured_data = {
            "full_name": "",
            "cnic": "",
            "phone": "",
            "email": "",
            "crime_category": "",
            "location": "",
            "date_of_incident": "",
            "time": "",
            "narrative": audio_text,  # Only this is filled
            "suspect_info": ""
        }

        return {
            "transcription": audio_text,
            "structured_data": structured_data
        }

    except Exception as e:
        print(f"Exception:\n{traceback.format_exc()}")
        return {"error": f"Unexpected error: {str(e)}"}
