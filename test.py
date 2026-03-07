import certifi
from pymongo import MongoClient

client = MongoClient(
    "mongodb+srv://nida_azam:weirdo21!@fircluster.a71bcu6.mongodb.net/",
    tlsCAFile=certifi.where()
)

client.admin.command("ping")
print("✅ MongoDB connected!")