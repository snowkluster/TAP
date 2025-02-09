#!/usr/bin/env python3

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, text, inspect
from typing import List, Dict
from pydantic import BaseModel
import os

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://portal.localhost"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Use environment variables for sensitive data
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://dbuser:dbpassword@localhost:5432/darkweb")

engine = create_engine(DATABASE_URL)

TABLES = [
    "bianlian", "breach", "cicada3301", "cracked", "darkvault",
    "doxbin", "onni", "play", "ransomhub"
]

class SearchResult(BaseModel):
    table_name: str
    matches: List[Dict]

@app.get('/health')
async def health_check():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        return {"status": "Alive", "database": "Connected"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database connection failed: {str(e)}")

def get_table_columns(connection, table_name: str) -> List[str]:
    """Fetch all column names for a given table."""
    inspector = inspect(connection)
    columns = inspector.get_columns(table_name)
    return [column['name'] for column in columns]

@app.get('/search/{search_term}', response_model=List[SearchResult])
async def search_all_tables(search_term: str):
    results = []
    
    try:
        with engine.connect() as connection:
            for table in TABLES:
                columns = get_table_columns(connection, table)
                
                # Build search conditions for each column
                search_conditions = " OR ".join(
                    f'CAST("{col}" AS TEXT) ILIKE :search_term' 
                    for col in columns
                )
                
                # Build and execute the search query
                search_query = text(f"""
                    SELECT * FROM {table}
                    WHERE {search_conditions}
                """)
                
                matches = [
                    dict(zip(columns, row))
                    for row in connection.execute(
                        search_query, 
                        {"search_term": f"%{search_term}%"}
                    )
                ]
                
                if matches:
                    results.append({
                        "table_name": table,
                        "matches": matches
                    })
                    
        return results
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Search failed: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=9000)