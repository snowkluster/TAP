#!/usr/bin/env python3

from fastapi import FastAPI, Query
from bs4 import BeautifulSoup as bs
import json
from pathlib import Path
from playwright.sync_api import sync_playwright

app = FastAPI()

def extract_data_from_page(html_content):
    response_data = []
    soup = bs(html_content, 'html.parser')
    parent_div = soup.find('div', class_='card shadow-sm bg-white rounded border-0')
    thread_divs = parent_div.find_all('div', class_='d-none d-sm-none d-md-none d-lg-block d-xl-block d-xxl-block')
    for div in thread_divs:
        order_all = div.find('div').find_all('div')
        post_div = order_all[0].find_all('a')[0]
        author_url = f"https://onniforums.com/{order_all[4].find('a', href=True)['href']}"
        post_title = post_div.get_text()
        thread_url = f"https://onniforums.com/{post_div['href']}"
        post_link = order_all[0].find_all('a')[1]['href']
        post_url = f"https://onniforums.com/{post_link}"

        third_div = order_all[2]
        replies, views = third_div.text.strip().split()[1:4:2]
        date_posted = order_all[5].find('span', class_='text-muted').get_text()
        post_data = {
            "post_title": post_title,
            "author_url": author_url,
            "thread_url": thread_url,
            "post_link": post_url,
            "replies": replies,
            "views": views,
            "date_posted": date_posted
        }
        response_data.append(post_data)
    return response_data


@app.get("/search/")
def get_forum_posts(search_term: str = Query(...)):
    with sync_playwright() as p:
        browser = p.firefox.launch(headless=True, slow_mo=1000)
        context = browser.new_context()
        context.add_cookies(json.loads(Path("../json/onni_cookies.json").read_text()))
        page = context.new_page()
        page.goto("https://onniforums.com/")
        page.fill('input.form-control.border.border', search_term)
        page.click('button.btn.btn-multipage.border[type="submit"]')
        response_data = []

        while True:
            page.wait_for_load_state("networkidle")
            html_content = page.content()
            response_data.extend(extract_data_from_page(html_content))
            next_page_link = page.query_selector("a.pagination_next")
            if next_page_link:
                next_page_link.click()
                page.wait_for_load_state("networkidle")
            else:
                break
        browser.close()
    return response_data
