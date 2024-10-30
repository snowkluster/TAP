#!/usr/bin/env python3

import asyncio
import csv
from playwright.async_api import async_playwright
from bs4 import BeautifulSoup

async def scrape_content(html_content):
    soup = BeautifulSoup(html_content, 'html.parser')
    news_items = soup.find_all('th', class_='News')

    scraped_data = []
    for item in news_items:
        title = item.contents[0].text.strip()
        location = item.find('i', class_='location').next_sibling.strip()
        link = item.find('i', class_='link').next_sibling.strip()
        
        views = item.find(string=lambda s: 'views:' in s).split(':')[1].strip()
        added_date = item.find(string=lambda s: 'added:' in s).split(':')[1].strip()
        publication_date = item.find(string=lambda s: 'publication date:' in s).split(':')[1].strip()

        scraped_data.append({
            "Title": title,
            "Location": location,
            "Link": link,
            "Views": views,
            "Added": added_date,
            "Publication Date": publication_date
        })

    return scraped_data

async def main():
    all_scraped_data = []

    async with async_playwright() as p:
        browser = await p.firefox.launch(proxy={"server": "socks5://127.0.0.1:9050"}, headless=True, slow_mo=1000)
        context = await browser.new_context(viewport={"width": 1400, "height": 800})

        for page_number in range(1, 51):
            page = await context.new_page()
            url = f"http://k7kg3jqxang3wh7hnmaiokchk7qoebupfgoik6rha6mjpzwupwtj25yd.onion/index.php?page={page_number}"
            
            await page.goto(url, wait_until="networkidle")
            content = await page.content()
            scraped_data = await scrape_content(content)
            all_scraped_data.extend(scraped_data)
            await page.close()
        await browser.close()

    with open("scraped_data.csv", "w", newline='', encoding='utf-8') as csvfile:
        fieldnames = ["Title", "Location", "Link", "Views", "Added", "Publication Date"]
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(all_scraped_data)

asyncio.run(main())
