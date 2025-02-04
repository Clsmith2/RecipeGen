import os
from pymongo import MongoClient
from transformers import pipeline
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
MONGO_URI = os.getenv('MONGO_URI')

# Connect to MongoDB
client = MongoClient(MONGO_URI)
db = client['test']  # Adjust to your database name
collection = db['groceryitems']  # Adjust to your collection name

def generate_product_embeddings():
    # Load the embedding model
    embed = pipeline('feature-extraction', model='sentence-transformers/all-MiniLM-L6-v2')

    # Fetch all items from the collection
    items = collection.find()

    print(f"Found {items.count()} items to process.")

    # Process each item
    for index, item in enumerate(items):
        sentence = f"{item['name']}"
        embedding = embed(sentence)
        embedding_vector = embedding[0][0]  # Taking the first layer's first embedding

        # Update the item with the new embedding
        collection.update_one({'_id': item['_id']}, {'$set': {'embedding': embedding_vector}})

        print(f"Processed {index + 1}/{items.count()}: {item['name']}")

    print("Embeddings generated and saved.")

if __name__ == "__main__":
    generate_product_embeddings()
