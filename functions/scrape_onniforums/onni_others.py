#!/usr/bin/env python3

import csv
import json
from pathlib import Path
from bs4 import BeautifulSoup as bs
from playwright.sync_api import sync_playwright

def extract_data_from_page(html_content):
    response_data = []
    soup = bs(html_content, 'html.parser')
    parent_div = soup.find('div', class_='card shadow-sm p-2 p-sm-2 p-md-2 p-lg-5 p-xl-5 p-xxl-5 border-0 mt-3')
    thread_divs = parent_div.find_all('div', class_='d-none d-sm-none d-md-none d-lg-block d-xl-block d-xxl-block')[1:]
    for div in thread_divs:
        order_all = div.find('div').find_all('div')
        if len(order_all) == 7:
            continue
        author_elem = order_all[1].find_all('span')[1].find('a')
        author_url = f"{author_elem['href']}"
        author_name = author_elem.get_text(strip=True)
        post_elem = order_all[1].find('a')
        post_title = post_elem.get_text(strip=True)
        post_url = f"https://onniforums.com/{post_elem['href']}"
        third_div = order_all[2]
        replies = third_div.find_all('span')[0].next_sibling.strip()
        views = third_div.find_all('span')[1].next_sibling.strip()
        date_elem = order_all[5].find('span')
        if date_elem and date_elem.has_attr('title'):
            post_date = date_elem['title']
        else:
            post_date = order_all[5].get_text(strip=True).split(',')[0]
        post_date = post_date.strip()

        post_data = {
            'post_name': post_title,
            'post_author': author_name,
            'post_author_url': author_url,
            'post_link': post_url,
            'post_date': post_date,
            'views': views,
            'replies': replies
        }
        response_data.append(post_data)
    return response_data

def save_to_csv(scrape_data, filename='onni_others.csv'):
    with open(filename, 'a', newline='', encoding='utf-8') as csvfile:
        fieldnames = ['post_name', 'post_author', 'post_author_url', 'post_link', 'post_date', 'views', 'replies']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        if csvfile.tell() == 0:
            writer.writeheader()

        for entry in scrape_data:
            writer.writerow(entry)

with sync_playwright() as playwright:
    browser = playwright.firefox.launch(headless=True, slow_mo=1000)
    context = browser.new_context(
        color_scheme="dark",
        viewport={"width": 1920, "height": 968},
    )
    context.add_init_script(
        "Object.defineProperty(navigator, 'webdriver', {get: () => undefined})"
    )
    context.add_cookies(json.loads(Path("onni_cookies.json").read_text()))
    page = context.new_page()
    page.goto("https://onniforums.com/forum-54.html")

    while True:
        page.wait_for_load_state("networkidle")
        html_content = page.content()
        data = extract_data_from_page(html_content)
        save_to_csv(data)
        next_page_link = page.query_selector("a.pagination_next")
        if next_page_link:
            next_page_link.click()
            page.wait_for_load_state("networkidle")
        else:
            break

    browser.close()
