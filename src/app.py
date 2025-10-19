# src/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from chatbot import respond

app = Flask(__name__)
CORS(app)

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    message = data.get("message", "")
    # optional: role & auth token can be passed here (role = citizen/officer)
    reply = respond(message)
    return jsonify({"reply": reply})

if __name__ == "__main__":
    app.run(debug=True, port=5005)
