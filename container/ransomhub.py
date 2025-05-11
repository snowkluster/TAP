import asyncio
from typing import Optional

from playwright.async_api import async_playwright
from bs4 import BeautifulSoup
import csv

async def main():
    async with async_playwright() as p:
        browser = await p.firefox.launch(proxy={"server": "socks5://127.0.0.1:9050"}, headless=False, slow_mo=1000)
        context = await browser.new_context(viewport={"width": 1400, "height": 800})
        page = await context.new_page()
        url = "http://ransomxifxwc5eteopdobynonjctkxxvap77yqifu2emfbecgbqdw6qd.onion"
        await page.goto(url, wait_until="networkidle")
        content = await page.content()
        await browser.close()
        soup = BeautifulSoup(content, 'html.parser')
        cards = soup.find_all('div', class_='card rounded overflow-hidden')
        scraped_data = []

        for card in cards:
            name = card.find('div', class_='card-title').get_text(strip=True)
            stats = card.find_all('p')[1].get_text(strip=True)

            visits = stats.split('Visits: ')[1].split('Data Size: ')[0].strip()
            data_size = stats.split('Data Size: ')[1].split('Last View: ')[0].strip()
            last_view = stats.split('Last View: ')[1].strip()
            date = card.find('div', class_='card-footer').get_text(strip=True)

            countdown_element = card.find('strong', class_='countdown-date')
            if countdown_element:
                countdown_time = countdown_element.get_text(strip=True)
            else:
                countdown_time = "Published"
            scraped_data.append({
                'name': name,
                'visits': visits,
                'data_size': data_size,
                'last_view': last_view,
                'date': date,
                'countdown_time': countdown_time
            })

        with open("../database/ransomhub_posts.csv", "w", newline='', encoding='utf-8') as f: # type: Optional["SupportsWrite[str]"]
            writer = csv.DictWriter(f, fieldnames=scraped_data[0].keys())
            writer.writeheader()
            writer.writerows(scraped_data)

asyncio.run(main())