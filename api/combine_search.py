from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import httpx
import asyncio
from typing import Dict, Any
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://portal.localhost"
]

# Add CORSMiddleware to your FastAPI app
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows the frontend to make requests
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)


# Configure the base URLs for each API with correct local ports
API_ENDPOINTS = {
    # "breachforums": "http://localhost:8001/search/", # Will use later, if we make to many requests then it cause issues
    "breachforums": "http://localhost:8010/search/",
    "doxbin": "http://localhost:8002/search/"
}


async def fetch_api_results(client: httpx.AsyncClient, api_name: str, base_url: str, search_term: str) -> Dict[
    str, Any]:
    """
    Fetch results from a single API endpoint with detailed error logging
    """
    try:
        logger.info(f"Attempting to fetch from {api_name} at {base_url}")
        response = await client.get(
            base_url,
            params={"search_term": search_term},
            timeout=30.0  # Increased timeout for local development
        )

        if response.status_code == 200:
            logger.info(f"Successfully fetched data from {api_name}")
            return response.json()
        else:
            error_msg = f"HTTP {response.status_code} from {api_name}: {response.text}"
            logger.error(error_msg)
            return {"error": error_msg}

    except httpx.TimeoutException as e:
        error_msg = f"Timeout connecting to {api_name} at {base_url}, {e}"
        logger.error(error_msg)
        return {"error": error_msg}
    except httpx.ConnectError as e:
        error_msg = f"Failed to connect to {api_name} at {base_url}, {e}"
        logger.error(error_msg)
        return {"error": error_msg}
    except Exception as e:
        error_msg = f"Unexpected error for {api_name}: {str(e)}"
        logger.error(error_msg)
        return {"error": error_msg}


@app.get("/search/")
async def aggregate_search(search_term: str):
    """
    Endpoint that aggregates search results from multiple APIs
    """
    if not search_term:
        raise HTTPException(status_code=400, detail="search_term parameter is required")

    logger.info(f"Received search request for term: {search_term}")

    async with httpx.AsyncClient(timeout=60.0) as client:  # Increased client timeout
        tasks = {
            api_name: fetch_api_results(client, api_name, base_url, search_term)
            for api_name, base_url in API_ENDPOINTS.items()
        }

        results = await asyncio.gather(*tasks.values(), return_exceptions=True)

        successful = {}
        failed = {}

        for api_name, result in zip(tasks.keys(), results):
            if isinstance(result, Exception):
                failed[api_name] = str(result)
            elif isinstance(result, dict) and "error" in result:
                failed[api_name] = result["error"]
            else:
                successful[api_name] = result

        response = {
            "successful": successful,
            "failed": failed
        }

        logger.info(f"Completed search request. Success: {len(successful)}, Failed: {len(failed)}")
        return response


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")