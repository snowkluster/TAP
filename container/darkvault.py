#!/usr/bin/env python3

import csv
from bs4 import BeautifulSoup
from time import sleep
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.firefox.launch(slow_mo=1000,headless=False,proxy={"server": "socks5://127.0.0.1:9050"})
    context = browser.new_context(viewport={"width": 1400, "height": 800})
    page = context.new_page()
    page.goto("http://mdhby62yvvg6sd5jmx5gsyucs7ynb5j45lvvdh4dsymg43puitu7tfid.onion",wait_until="networkidle")
    sleep(5)
    content = page.content()
    soup = BeautifulSoup(content, 'html.parser')

    post_blocks = soup.find_all('div', class_='post-block')

    # Prepare the CSV file for saving the data
    csv_file = '../database/darkvault_posts.csv'

    # Open the CSV file in append mode ('a') to add data
    with open(csv_file, mode='a', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)

        # Write the header row if the file is empty
        if file.tell() == 0:
            writer.writerow(['Name', 'Time Till Post', 'Description', 'Post Date'])

        # Loop through each post block and extract the data
        for post in post_blocks:
            # Extract post title (name)
            post_title = post.find('div', class_='post-title').text.strip()

            # Extract time till post (handle both timer and published status)
            post_timer = post.find('div', class_='post-timer')
            if post_timer:
                timer_data = post_timer.find('div', class_='timer')
                time_left = ' '.join([span.text for span in timer_data.find_all('span')])
            elif post.find('div', class_='post-timer-end'):
                time_left = 'Published'  # When 'post-timer-end' is found
            else:
                time_left = 'Unknown'

            # Extract post description
            post_description = post.find('div', class_='post-block-text').text.strip()

            # Extract post date
            post_date = post.find('div', class_='updated-post-date').text.strip().replace('Posted:', '').strip()

            # Prepare the data to be saved for the current post
            post_data = [post_title, time_left, post_description, post_date]

            # Write the extracted data to the CSV
            writer.writerow(post_data)

    print(f"Data saved to {csv_file}")