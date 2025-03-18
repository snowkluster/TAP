from fastapi import FastAPI, HTTPException, Path
from fastapi.middleware.cors import CORSMiddleware
import requests
from dotenv import load_dotenv
import os

load_dotenv()

origins = [
    "http://localhost:5173",
    "http://portal.localhost"
]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_KEY = os.getenv('VIRUS_API_KEY')
print(f"API_KEY: {API_KEY}")  # Debug print

@app.get("/check/{file_hash}")
def get_virustotal_data(file_hash: str = Path(..., description="The file hash to check on VirusTotal")):
    headers = {
        "accept": "application/json",
        "x-apikey": API_KEY
    }
    url = f"https://www.virustotal.com/api/v3/files/{file_hash}"

    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status() 
        data = response.json()
        print(data)
        filtered_data = {
            "type": data.get("data", {}).get("attributes", {}).get("type"),
            "type_tags": data.get("data", {}).get("attributes", {}).get("type_tags"),
            "size": data.get("data", {}).get("attributes", {}).get("size"),
            "meaningful_name": data.get("data", {}).get("attributes", {}).get("meaningful_name"),
            "reputation": data.get("data", {}).get("attributes", {}).get("reputation"),
            "md5": data.get("data", {}).get("attributes", {}).get("md5"),
            "sha1": data.get("data", {}).get("attributes", {}).get("sha1"),
            "last_analysis_stats": data.get("data", {}).get("attributes", {}).get("last_analysis_stats")
        }
        print(f"Filtered data: {filtered_data}")
        return filtered_data
    except requests.exceptions.RequestException as e:
        print(f"Request error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Network error: {str(e)}")
    except requests.exceptions.HTTPError as e:
        print(f"HTTP error: {e.response.status_code} - {e.response.text}")
        raise HTTPException(status_code=e.response.status_code, detail=f"VirusTotal API error: {e.response.text}")
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8006)
