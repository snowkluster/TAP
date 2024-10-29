#!/usr/bin/env python3

import csv
import json
from pathlib import Path
from bs4 import BeautifulSoup as bs
from playwright.sync_api import sync_playwright


def parse_forum_data(html_content):
    soup = bs(html_content, 'html.parser')
    rows = soup.find_all('tr', class_='__topic')

    extracted_data = []
    for row in rows:
        post_name_element = row.find('span', itemprop='name')
        second_td = row.find_all('td')[1] if len(row.find_all('td')) > 1 else None
        author_name = 'N/A'
        author_url = 'N/A'

        if second_td:
            author_link = second_td.select_one('span.desc a')
            if author_link:
                author_name = author_link.select_one('span span').text.strip() if author_link.select_one(
                    'span span') else 'N/A'
                author_url = author_link['href'] if 'href' in author_link.attrs else 'N/A'

        post_name = post_name_element.get_text(strip=True) if post_name_element else 'N/A'
        post_link = row.find('a', itemprop='url')['href'] if row.find('a', itemprop='url') else 'N/A'

        post_date_element = row.find('li', class_='desc lighter blend_links')
        post_date = post_date_element.get_text(strip=True).split('Today, ')[-1] if post_date_element else 'N/A'

        views = row.find_all('li')[1].get_text(strip=True).split()[0] if len(row.find_all('li')) > 1 else 'N/A'
        replies = row.find('meta', itemprop='interactionCount')['content'].split(':')[1].strip() if row.find('meta',
                                                                                                             itemprop='interactionCount') else 'N/A'

        extracted_data.append({
            'post_name': post_name,
            'post_author': author_name,
            'post_author_url': author_url,
            'post_link': post_link,
            'post_date': post_date,
            'views': views,
            'replies': replies
        })

    return extracted_data


def save_to_csv(scrape_data, filename='forum_data.csv'):
    with open(filename, 'a', newline='', encoding='utf-8') as csvfile:
        fieldnames = ['post_name', 'post_author', 'post_author_url', 'post_link', 'post_date', 'views', 'replies']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

        if csvfile.tell() == 0:
            writer.writeheader()

        for entry in scrape_data:
            writer.writerow(entry)


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True, slow_mo=1000)
    context = browser.new_context(
        color_scheme="dark",
        viewport={"width": 1920, "height": 968},
    )
    context.add_init_script(
        "Object.defineProperty(navigator, 'webdriver', {get: () => undefined})"
    )
    context.add_cookies(json.loads(Path("cookies.json").read_text()))

    page = context.new_page()
    page.goto("https://www.nulled.to/forum/184-dumps-databases/")

    while True:
        page.wait_for_selector('tr.__topic')
        content = page.content()
        data = parse_forum_data(content)
        save_to_csv(data)
        next_button = page.query_selector('a[rel="next"]')
        if next_button and not next_button.is_disabled():
            next_button.click()
            page.wait_for_timeout(1000)
        else:
            break

    browser.close()
