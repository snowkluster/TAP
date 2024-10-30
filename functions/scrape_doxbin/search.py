#!/usr/bin/env python3

from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup as bs
from random import randint
import json
from pathlib import Path
from time import sleep

SEARCH_TERM='thor'

def extract_table(tables):
    table = tables[0]
    data = []
    headers = [header.text.strip() for header in table.find_all('th')]
    rows = table.find_all('tr')[1:]  # Skip header row
    for row in rows:
        cells = row.find_all('td')
        if len(cells) < len(headers):
            continue
        row_data = {}
        for i, cell in enumerate(cells):
            links = cell.find_all('a')
            text = cell.text.strip()
            if i == 0 and links:
                row_data['Title'] = text
                row_data['Title_url'] = links[0].get('href')
            elif links:
                row_data[f'{headers[i]}_url'] = links[0].get('href')
            else:
                row_data[headers[i]] = text
        data.append(row_data)

    return data

with sync_playwright() as p:
    browser = p.firefox.launch(headless=True,slow_mo=1000)
    context = browser.new_context(
        color_scheme='dark',
        viewport={ 'width': 1920, 'height': 968 },
    )
    context.add_cookies(json.loads(Path("../../json/cookies.json").read_text()))
    context.add_init_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
    page = context.new_page()
    page.goto('https://doxbin.org/')
    sleep(randint(1,2))
    page.fill('input[name="search-query"]',SEARCH_TERM)
    page.click('input[value="Search"]')
    html_content = page.content()
    soup = bs(html_content, "html.parser")
    tables = soup.find_all("table")
    table_data = extract_table(tables)
    json_data = json.dumps(table_data, indent=4)
    print(json_data)
