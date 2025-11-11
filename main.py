# main.py
from fastapi import FastAPI
from chatbot import router  # import the router from chatbot.py

app = FastAPI()
app.include_router(router)

# Optional: a root endpoint
@app.get("/")
def root():
    return {"message": "AI Chatbot API is running."}
