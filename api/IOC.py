from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import requests
from typing import List, Dict
import os
from dotenv import load_dotenv  # Import dotenv to load environment variables

# Load environment variables from the .env file
load_dotenv()

# Initialize FastAPI app
app = FastAPI()

origins = [
    "http://localhost:5173",
]

# Add CORSMiddleware to your FastAPI app
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows the frontend to make requests
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

# Read the API_KEY from an environment variable
API_KEY = os.getenv("ABUSE_API_KEY")  # Read API key from .env

if not API_KEY:
    raise ValueError("API_KEY is missing. Please set the 'ABUSE_API_KEY' in the .env file.")

# Define helper function to process file data
def process_file(file_data: Dict):
    required_keys = ['sha3_384_hash', 'sha256_hash', 'sha1_hash', 'md5_hash', 'first_seen', 'origin_country', 'file_size', 'file_type_mime', 'intelligence', 'tags', 'file_name']
    new_data = {key: file_data.get(key) for key in required_keys}
    
    if file_data.get('signature') and file_data['signature'] not in ['sh', 'exe', 'elf']:
        file_name = file_data['signature']
    elif file_data.get('tags'):
        filtered_tags = [tag for tag in file_data['tags'] if tag not in ['sh', 'exe', 'elf']]
        file_name = filtered_tags[0] if filtered_tags else 'UNKNOWN'
    else:
        file_name = 'UNKNOWN'
        
    new_data['IOC Name'] = file_name
    return new_data

# Define the main function to fetch data from AbuseAPI and process it
@app.get("/", response_model=List[Dict])
async def fetch_and_process_data():
    url = "https://mb-api.abuse.ch/api/v1/"
    headers = {"Auth-Key": API_KEY}
    data = {
        "query": "get_recent",
        "selector": "time"  # We can't change this value.
    }
    
    response = requests.post(url, headers=headers, data=data)

    if response.status_code == 200:
        result_data = response.json()

        if not isinstance(result_data.get("data"), list):
            raise HTTPException(status_code=400, detail=f"The 'data' field is not a list. Instead, it is: {result_data.get('data')}")
        
        existing_data = result_data["data"]
        
        seen_hashes = set()
        all_data = []

        for file_data in existing_data:
            sha256_hash = file_data.get('sha256_hash')
            if sha256_hash and sha256_hash not in seen_hashes:
                seen_hashes.add(sha256_hash)
                new_data = process_file(file_data)
                all_data.append(new_data)
        
        return all_data
    else:
        raise HTTPException(status_code=response.status_code, detail="Failed to fetch data from Abuse API.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8008)
