#!/usr/bin/env python3

from time import sleep
import csv
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright

csv_file = 'bianlian_companies.csv'
fieldnames = ['Company Name', 'Date', 'Post URL']  # Added 'Post URL' column

# Open CSV file for writing
with open(csv_file, mode='w', newline='', encoding='utf-8') as file:
    writer = csv.DictWriter(file, fieldnames=fieldnames)
    writer.writeheader()

    with sync_playwright() as p:
        # Launch browser with proxy settings
        browser = p.firefox.launch(slow_mo=1000, headless=True, proxy={"server": "socks5://127.0.0.1:9050"})
        context = browser.new_context(viewport={"width": 1400, "height": 800})
        page = context.new_page()

        # Navigate to the target URL
        url = "http://bianlianlbc5an4kgnay3opdemgcryg2kpfcbgczopmm3dnbz3uaunad.onion/companies/"
        page.goto(url, wait_until="networkidle")

        # Wait for page content to load
        sleep(5)

        # Get page content and parse with BeautifulSoup
        content = page.content()
        soup = BeautifulSoup(content, 'html.parser')

        # Find all posts (li elements with class 'post')
        posts = soup.find_all('li', class_='post')

        # Loop through each post and extract data
        for post in posts:
            company_name = post.find('a').get_text(strip=True)  # Company name from the <a> tag
            date = post.find('span', class_='meta').get_text(strip=True)  # Date from the <span> tag
            post_url = post.find('a')['href']  # URL from the <a> tag's href attribute

            # Write the extracted data to CSV
            writer.writerow({'Company Name': company_name, 'Date': date, 'Post URL': post_url})

        # Close the browser
        browser.close()

# Inform the user that the data has been saved
print(f"Data saved to {csv_file}")
