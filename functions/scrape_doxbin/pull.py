#!/usr/bin/env python3
# pull data about a user profile
from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup
import json

# USER_URL="/user/DECAYEDDOXING"
USER_URL="/user/Maskenjagd"

def extract_user_info():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, slow_mo=1000)
        page = browser.new_page()
        page.goto(f"https://doxbin.org{USER_URL}")
        html_content = page.content()
        soup = BeautifulSoup(html_content, "html.parser")

        user_info = {}
        rows = soup.find_all('div', class_='uinfo-row')

        def find_value(label_text):
            for row in rows:
                header = row.find('div', class_='uinfo-h')
                if header and header.text.strip() == label_text:
                    value = row.find('div', class_='uinfo-i')
                    if value:
                        return value.text.strip()
            return 'N/A'

        user_info['User ID'] = find_value('User ID')
        user_info['User Name'] = f'{USER_URL}'
        user_info['Joined'] = find_value('Joined')
        user_info['Pastes'] = find_value('Pastes')
        user_info['Comments'] = find_value('Comments')
        user_info['Following'] = find_value('Following')
        user_info['Followers'] = find_value('Followers')
        user_info['Likes Given'] = find_value('Likes Given')
        user_info['Likes Received'] = find_value('Likes Received')

        comments_section = soup.find('div', class_='profile-comments')
        comments = []

        if comments_section:
            comment_divs = comments_section.find_all('div', class_='profile-comment')
            for comment_div in comment_divs:
                comment = {}
                username_link = comment_div.find('div', class_='profile-comment-username').find('a')
                comment['Username'] = username_link.text.strip() if username_link else 'N/A'
                comment['Username_url'] = username_link['href'] if username_link else 'N/A'
                comment['Content'] = comment_div.find('div', class_='profile-comment-content').text.strip()
                comment['Date'] = comment_div.get('title', 'N/A')
                comments.append(comment)

        user_info['Comments_Details'] = comments
        json_data = json.dumps(user_info, indent=4)
        print(json_data)

extract_user_info()
