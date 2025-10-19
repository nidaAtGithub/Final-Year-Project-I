# src/train_chatbot.py
import json
import numpy as np
import nltk
from nltk.stem import WordNetLemmatizer
import random
import pickle
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout
from tensorflow.keras.optimizers import Adam

lemmatizer = WordNetLemmatizer()

# load intents
with open("data/intents.json", "r", encoding="utf-8") as f:
    intents = json.load(f)

words = []
classes = []
documents = []
ignore_letters = ['?', '!', '.', ',']

for intent in intents["intents"]:
    for pattern in intent["patterns"]:
        tokenized = nltk.word_tokenize(pattern)
        words.extend(tokenized)
        documents.append((tokenized, intent["tag"]))
    if intent["tag"] not in classes:
        classes.append(intent["tag"])

words = [lemmatizer.lemmatize(w.lower()) for w in words if w not in ignore_letters]
words = sorted(list(set(words)))
classes = sorted(list(set(classes)))

# create training data
training = []
output_empty = [0] * len(classes)

for doc in documents:
    bag = []
    pattern_words = [lemmatizer.lemmatize(word.lower()) for word in doc[0]]
    for w in words:
        bag.append(1) if w in pattern_words else bag.append(0)

    output_row = list(output_empty)
    output_row[classes.index(doc[1])] = 1
    training.append([bag, output_row])

random.shuffle(training)
training = np.array(training, dtype=object)

train_x = np.array(list(training[:, 0]))
train_y = np.array(list(training[:, 1]))

# build model
model = Sequential()
model.add(Dense(128, input_shape=(len(train_x[0]),), activation='relu'))
model.add(Dropout(0.5))
model.add(Dense(64, activation='relu'))
model.add(Dropout(0.3))
model.add(Dense(len(train_y[0]), activation='softmax'))

model.compile(loss='categorical_crossentropy', optimizer=Adam(learning_rate=0.001), metrics=['accuracy'])

# train
history = model.fit(train_x, train_y, epochs=200, batch_size=8, verbose=1)

# save model and data
model.save("models/chatbot_model.h5")
pickle.dump(words, open("models/words.pkl", "wb"))
pickle.dump(classes, open("models/classes.pkl", "wb"))

print("Training completed. Model and pickles saved to models/")
