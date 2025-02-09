from fastapi import FastAPI, HTTPException, Path
from fastapi.middleware.cors import CORSMiddleware
import httpx
from dotenv import load_dotenv
import os

load_dotenv()

origins = [
    "http://localhost:5173",
    "http://portal.localhost"
]

# Add CORSMiddleware to your FastAPI app
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows the frontend to make requests
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

API_KEY = os.getenv('VIRUS_API_KEY')
URL_TEMPLATE = "https://www.virustotal.com/api/v3/files/{file_hash}"

@app.get("/check/{file_hash}")
async def get_virustotal_data(file_hash: str = Path(..., description="The file hash to check on VirusTotal")):
    headers = {
        "accept": "application/json",
        "x-apikey": API_KEY
    }

    url = URL_TEMPLATE.format(file_hash=file_hash)

    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, headers=headers)
            response.raise_for_status()
            data = response.json()
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

            return filtered_data

        except httpx.RequestError as e:
            raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=response.status_code, detail=f"HTTP error occurred: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8006)