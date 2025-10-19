from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# 📝 mock FIR data
FIRS = [
    {"fir_no": "2025-001", "status": "Under Investigation", "location": "G-11"},
    {"fir_no": "2025-002", "status": "Closed", "location": "G-10"},
    {"fir_no": "2025-003", "status": "In Court", "location": "F-8"},
]

@app.route("/api/fir/status/<fir_no>", methods=["GET"])
def get_fir_status(fir_no):
    for fir in FIRS:
        if fir["fir_no"] == fir_no:
            return jsonify(fir)
    return jsonify({"error": "FIR not found"}), 404

@app.route("/api/fir/location/<loc>", methods=["GET"])
def get_firs_by_location(loc):
    result = [fir for fir in FIRS if fir["location"].lower() == loc.lower()]
    return jsonify(result)

if __name__ == "__main__":
    app.run(port=6000, debug=True)
