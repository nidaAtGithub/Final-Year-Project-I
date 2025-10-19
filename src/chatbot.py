# src/chatbot.py
import random
import json
import pickle
import numpy as np
import nltk
from nltk.stem import WordNetLemmatizer
from tensorflow.keras.models import load_model
import re
import requests

lemmatizer = WordNetLemmatizer()
model = load_model("models/chatbot_model.h5")
words = pickle.load(open("models/words.pkl", "rb"))
classes = pickle.load(open("models/classes.pkl", "rb"))

with open("data/intents.json", encoding="utf-8") as f:
    intents = json.load(f)

def clean_up_sentence(sentence):
    sentence_words = nltk.word_tokenize(sentence)
    sentence_words = [lemmatizer.lemmatize(word.lower()) for word in sentence_words]
    return sentence_words

def bow(sentence, words, show_details=True):
    sentence_words = clean_up_sentence(sentence)
    bag = [0]*len(words)
    for s in sentence_words:
        for i,w in enumerate(words):
            if w == s:
                bag[i] = 1
    return np.array(bag)

def predict_class(sentence, model):
    p = bow(sentence, words, show_details=False)
    res = model.predict(np.array([p]))[0]
    ERROR_THRESHOLD = 0.25
    results = [[i,r] for i,r in enumerate(res) if r>ERROR_THRESHOLD]
    results.sort(key=lambda x: x[1], reverse=True)
    return_list = []
    for r in results:
        return_list.append({"intent": classes[r[0]], "probability": str(r[1])})
    return return_list

def get_response(intents_list, intents_json):
    if not intents_list:
        return "Sorry, I didn't get that. Can you rephrase?"
    tag = intents_list[0]['intent']
    list_of_intents = intents_json['intents']
    for i in list_of_intents:
        if i['tag'] == tag:
            result = random.choice(i['responses'])
            break
    return result

def respond(message):
    ints = predict_class(message, model)
    if not ints:
        return "Sorry, I didn't understand. Can you rephrase?"
    tag = ints[0]['intent']

    # simple parameter checks
    if tag == "check_status":
        fir_no = extract_fir_number(message)
        if fir_no:
            # 🔗 Call the mock FIR API
            try:
                res = requests.get(f"http://127.0.0.1:6000/api/fir/status/{fir_no}")
                if res.status_code == 200:
                    data = res.json()
                    return f"FIR {data['fir_no']} in {data['location']} is currently: {data['status']}."
                else:
                    return "I couldn't find that FIR number."
            except Exception as e:
                return "Error reaching FIR system."
        else:
            return "Please provide your FIR number (e.g., 2025-010)."

    if tag == "officer_lookup":
        loc = extract_location(message)
        if loc:
            try:
                res = requests.get(f"http://127.0.0.1:6000/api/fir/location/{loc}")
                data = res.json()
                if data:
                    reply = f"FIRs found in {loc}:\n" + "\n".join([f"{f['fir_no']} - {f['status']}" for f in data])
                    return reply
                else:
                    return f"No FIRs found in {loc}."
            except Exception as e:
                return "Error reaching FIR system."
        else:
            return "Please specify a location (e.g., G-11)."

    # fallback to default response
    return get_response(ints, intents)


def extract_fir_number(message: str):
    # FIR numbers in your system look like 2025-010 or 1234
    match = re.search(r"\b\d{4}-\d+\b|\b\d{3,6}\b", message)
    return match.group(0) if match else None


def extract_location(message: str):
    # Very basic location extraction example
    locations = ["G-10", "G-11", "F-8", "F-10", "Blue Area", "Islamabad"]
    for loc in locations:
        if loc.lower() in message.lower():
            return loc
    return None

# quick test
if __name__ == "__main__":
    print(respond("hello"))
    print(respond("I want to file an FIR"))
