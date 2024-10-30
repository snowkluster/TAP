#!/usr/bin/env python3

from fastapi import FastAPI, Query
from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup as bs
import json
from pathlib import Path

app = FastAPI()

def extract_table_data(page_content):
    search_results = []
    soup = bs(page_content, 'html.parser')

    table = soup.find('table', class_='tborder')
    if table:
        rows = table.find_all('tr')
        for row in rows[2:]:
            columns = row.find_all('td')
            if len(columns) >= 7:
                post_name = ""
                post_link = ""
                author_url = ""
                author_div = columns[2].find('div', class_='author smalltext')
                if author_div:
                    author_a = author_div.find('a')
                    author_url = author_a['href']
                subject_old_tag = columns[2].find('a', class_='subject_old')
                if subject_old_tag:
                    post_name = subject_old_tag.text.strip()
                    post_url = subject_old_tag['href']
                    post_link = f"https://breachforums.st/{post_url}"
                else:
                    subject_new_tags = columns[2].find('a', class_='subject_new')
                    post_name = subject_new_tags.text.strip()
                    post_url = subject_new_tags['href']
                    post_link = f"https://breachforums.st/{post_url}"
                replies = columns[4].find('a').text.strip()
                views = columns[5].text.strip()
                post_date_full = columns[6].find('span').text.strip()
                post_date = post_date_full.split('\n')[0]

                search_results.append({
                    'post_name': post_name,
                    'author': author_url,
                    'post_link': post_link,
                    'replies': replies,
                    'views': views,
                    'post_date': post_date
                })

    return search_results

@app.get("/search/")
def search_breach_forums(search_term: str = Query(..., min_length=1)):
    with sync_playwright() as p:
        browser = p.firefox.launch(headless=False, slow_mo=10000)
        context = browser.new_context(
            color_scheme='dark',
            viewport={'width': 1920, 'height': 968},
        )
        context.add_cookies(json.loads(Path("../json/breach_cookies.json").read_text()))
        context.add_init_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
        page = context.new_page()
        page.goto("https://breachforums.st/search")
        page.fill("[name='keywords']", search_term)
        page.click('input[type="submit"].button[name="submit"][value="Search"]')
        all_responses = []

        while True:
            html_content = page.content()
            current_response = extract_table_data(html_content)
            all_responses.extend(current_response)
            next_button = page.query_selector('a.pagination_next:has-text("Next")')
            if next_button:
                next_button.click()
                page.wait_for_load_state('networkidle')
            else:
                break

        browser.close()

    return all_responses
