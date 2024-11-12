#!/usr/bin/env python3

from playwright.sync_api import sync_playwright
import csv
from bs4 import BeautifulSoup

with sync_playwright() as p:
    browser = p.firefox.launch(slow_mo=1000,headless=True,proxy={"server": "socks5://127.0.0.1:9050"})
    context = browser.new_context(viewport={"width": 1400, "height": 800})
    page = context.new_page()
    page.goto("http://cicadabv7vicyvgz5khl7v2x5yygcgow7ryy6yppwmxii4eoobdaztqd.onion",wait_until="networkidle")
    content = page.content()
    soup = BeautifulSoup(content, 'html.parser')

    # Find the container div with the ID 'index_blog'
    index_blog = soup.find('div', id='index_blog')

    # Find all individual post divs inside this container
    posts = index_blog.find_all('div', class_='w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/3 px-6 mb-12')

    # List to store data
    data = []

    # Loop through each post and extract the data
    for post in posts:
        # Extract the title of the post
        title = post.find('h2', class_='font-bold text-yellow-500 mb-4 break-words uppercase').text.strip()

        # Extract the web URL
        web_url = post.find('a', class_='text-blue-400 text-sm ml-1 hover:text-blue-300')['href']

        # Extract the size data
        size_data = post.find('span', class_='text-white text-sm ml-1').text.strip()

        # Extract the publication date
        publication_date = post.find_all('span', class_='text-white text-sm ml-1')[1].text.strip()

        # Extract the description
        description = post.find('p',
                                class_='p-2 mt-1 text-gray-400 text-mg mb-6 overflow-y-auto whitespace-pre-wrap border border-gray-700 rounded-lg').text.strip()

        # Append the extracted data as a dictionary
        data.append({
            'Title': title,
            'Web URL': web_url,
            'Size Data': size_data,
            'Publication Date': publication_date,
            'Description': description
        })

    # Define CSV file path
    csv_file_path = 'cicada3301_posts.csv'

    # Write data to a CSV file
    with open(csv_file_path, mode='w', newline='', encoding='utf-8') as file:
        # Create a CSV DictWriter object
        writer = csv.DictWriter(file, fieldnames=['Title', 'Web URL', 'Size Data', 'Publication Date', 'Description'])

        # Write the header (fieldnames)
        writer.writeheader()

        # Write the rows (post data)
        writer.writerows(data)

    print(f"Data saved to {csv_file_path}")
