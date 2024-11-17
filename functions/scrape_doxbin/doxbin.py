#!/usr/bin/env python3

from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup
from time import sleep
import json
from pathlib import Path
import csv

# with sync_playwright() as p:
#     browser = p.firefox.launch(headless=False,slow_mo=10000)
#     context = browser.new_context()
#     page = context.new_page()
#     page.goto("https://doxbin.org/login")
#     sleep(15)
#     page.fill('input#username','dump_master345')
#     page.fill('input#password','Zxqz33FmFbijeA')
#     page.click('input[value="Login"]')
#     cookies = context.cookies()
#     Path("nulled_cookies.json").write_text(json.dumps(cookies))

# Working on user agent part, IDK man this shit keeps breaking...

# user_agent_strings = [
#     'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.2227.0 Safari/537.36',
#     'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
#     'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.3497.92 Safari/537.36',
#     'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
#     'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
#     'Mozilla/5.0 (X11; Linux x86_64; rv:129.0) Gecko/20100101 Firefox/129.0'
# ]
# user_agent = choice(user_agent_strings)

# this does about 5 % i guess 
def extract_table_data(table):
    rows = []
    for row in table.find("tbody").find_all("tr"):
        cells = [cell.get_text(strip=True) for cell in row.find_all("td")]
        # Extract hyperlinks and their text if available 50 /50 give or take IDK man
        links = [a.get("href") for a in row.find_all("a")]
        row_data = cells + links
        rows.append(row_data)
    return rows

# def save_table_data(tables, filename):
#     with open(filename, 'a', encoding='utf-8') as file:
#         for idx, table in enumerate(tables):
#             rows = extract_table_data(table)
#             for row in rows:
#                 file.write(", ".join(row) + "\n")

# this doesn't crash 
def save_table_data(all_tables, filename):
    with open(filename, 'a', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        for table in all_tables:
            rows = extract_table_data(table)
            writer.writerows(rows)

with sync_playwright() as p:
    browser = p.firefox.launch(headless=True, slow_mo=1000)
    context = browser.new_context(
        # user_agent=f"{user_agent}",
        color_scheme='dark',  # Emulate dark mode, doesn't work on firefox
        viewport={ 'width': 1920, 'height': 968 },
    )
    context.add_init_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
    context.add_cookies(json.loads(Path("../../json/cookies.json").read_text()))
    page = context.new_page()
    page.goto("https://doxbin.org/",timeout=60000)
    sleep(10)
    page_number = 1
    while True:
        print(f"Extracting data from page {page_number}...")
        html_content = page.content()
        soup = BeautifulSoup(html_content, "html.parser")
        tables = soup.find_all("table")
        print(f"On page {page_number}")
        print("Writing data to file...")
        save_table_data(tables, '../../database/doxbin_table.csv')
        # Check if the "next" button is disabled
        next_button = page.query_selector('a[style*="border-top-right-radius"]')
        
        if next_button and next_button.get_attribute('class') == 'disabled':
            print("No more pages to navigate.")
            break
        
        # Click the "next" button and wait for the page to load
        print("Navigating to next page...")
        page.click('a[style*="border-top-right-radius"]')
        sleep(1.673)
        
        page_number += 1