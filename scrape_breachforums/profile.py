#!/usr/bin/env python3

# https://breachforums.st/User-IntelBroker
# https://breachforums.st/User-Happydreamer

import json
from pathlib import Path
from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup as bs

def extract_profile_data(page_html):
    soup = bs(page_html, 'html.parser')
    profile_info_div = soup.find('div', class_='profile__short-info')
    table = profile_info_div.find('table')
    second_row = table.find_all('tr')[1]

    img_tag = second_row.find('img')
    title = img_tag.get('title')

    third_row = table.find_all('tr')[2]
    joined_text = third_row.get_text(strip=True)
    joined_date = joined_text.split('Joined:')[1].strip()

    fourth_row = table.find_all('tr')[3]
    time_spent_text = fourth_row.get_text(strip=True)
    time_spent_online = time_spent_text.split('Time Spent Online:')[1].strip()

    fifth_row = table.find_all('tr')[4]
    identifier_text = fifth_row.get_text(strip=True)
    identifier_start = identifier_text.find('User Identifier:') + len('User Identifier:')
    identifier_end = identifier_text.find(' [', identifier_start)
    user_identifier = identifier_text[identifier_start:identifier_end].strip()

    sixth_row = table.find_all('tr')[-1]
    members_referred = sixth_row.find_all('a')[-1].get_text()


    main_info_div = soup.find('div', class_='profile__main-info')
    tables = main_info_div.find_all('table')
    second_table = tables[1]
    rows = second_table.find_all('tr')

    second_row = rows[1]
    total_threads_text = second_row.get_text(strip=True)
    total_threads = total_threads_text.split('Total Threads:')[1].strip().split(' ')[0]

    third_row = rows[2]
    total_posts_text = third_row.get_text(strip=True)
    total_posts = total_posts_text.split('Total Posts:')[1].strip().split(' ')[0]

    fourth_row = rows[3]
    reputation_strong = fourth_row.find('strong', class_='reputation_positive')
    if reputation_strong:
        reputation = reputation_strong.get_text(strip=True).split(' ')[0]
    else:
        reputation = ''
    
    return {
        'Title': title,
        'Total Posts': total_posts,
        'Total Threads': total_threads,
        'Reputation': reputation,
        'Time Spent Online': time_spent_online,
        'Joined': joined_date,
        'Members Referred': members_referred,
        'User Identifier': user_identifier,
    }

def main():
    url = 'https://breachforums.st/User-Happydreamer'  # Replace with the actual URL
    
    with sync_playwright() as p:
        browser = p.firefox.launch(headless=True,slow_mo=1000)
        context = browser.new_context(
            color_scheme='dark',
            viewport={'width': 1920, 'height': 968},
        )
        context.add_cookies(json.loads(Path("breach_cookies.json").read_text()))
        context.add_init_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
        page = context.new_page()
        page.goto(url)
        page_html = page.content()
        browser.close()
    
    profile_data = extract_profile_data(page_html)
    profile_json = json.dumps(profile_data, indent=4)
    print(profile_json)

if __name__ == "__main__":
    main()
