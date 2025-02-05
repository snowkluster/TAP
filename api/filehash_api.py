#!/usr/bin/env python3

import requests
import json
from fastapi import FastAPI

app = FastAPI()

API_KEY='XXXXXXXXXXXXX'
# FILE_HASH='c9bd511ee0e42e1f3f929496cbfbc254b1f49c8fb5806f1827c85a6cdaadab6d'
FILE_HASH = str(input("Enter filehash: "))
URL=f"https://www.virustotal.com/api/v3/files/{FILE_HASH}"
HEADERS = {
    "accept": "application/json",
    "x-apikey": API_KEY
}
try:
    response = requests.get(URL, headers=HEADERS)
    response.raise_for_status()
    data = response.json()
    print(json.dumps(data, indent=4))
    with open('virustotal_response.json', 'w') as json_file:
        json.dump(data, json_file, indent=4)
except requests.exceptions.RequestException as e:
    print(f"An error occurred: {e}")
