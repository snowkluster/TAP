#!/usr/bin/env python3

from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup
from fastapi import FastAPI
from time import sleep
import json

app = FastAPI()

def scrape_data(data):
    soup = BeautifulSoup(data, 'html.parser')
    rows = soup.find_all('tr')
    result = []
    for row in rows:
        td_elements = row.find_all('td')
        if len(td_elements) >= 3:
            try:
                date = td_elements[0].text.strip()
                title_tag = td_elements[1].find('a').find('code')
                title = title_tag.text.strip() if title_tag else ""
                group_url = td_elements[2].find_all('a')[0]['href']
                result.append({
                    "date": date,
                    "title": title,
                    "group_url": group_url
                })
            except IndexError:
                continue
        else:
            continue
    return result

@app.get("/scrape")
def scrape_page():
    with sync_playwright() as p:
        browser = p.firefox.launch(headless=True,slow_mo=100)
        context = browser.new_context(
            color_scheme="dark",
            viewport={"width": 1920, "height": 968},
        )
        context.add_init_script(
            "Object.defineProperty(navigator, 'webdriver', {get: () => undefined})"
        )
        page = context.new_page()
        page.goto("https://ransomwatch.telemetry.ltd/#/recentposts")
        sleep(5)
        html_content = page.content()
        browser.close()
    return scrape_data(html_content)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8009)