#!/usr/bin/env python3

import json
import csv
from pathlib import Path
from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup as bs4

def extract_table_data(page_content):
    search_results = []
    table = page_content.find('table', class_='tborder clear')
    if table:
        rows = table.find_all('tr', class_='inline_row')
        for row in rows:
            cells = row.find_all('td')
            if len(cells) > 1:
                second_td = cells[1]
                first_div = second_td.find('div').find_all('div')[0]
                post_url = first_div.find('a').get('href')
                title_element = second_td.find('div').find('div').find('span').find('a')
                title = title_element.get_text() if title_element else ''
                if not title:
                    title_span = second_td.find('span', class_='subject_new')
                    if title_span:
                        title_link = title_span.find('a')
                        if title_link:
                            title = title_link.get_text()
                if not title:
                    if post_url:
                        url_part = post_url.split('-')[1:]
                        title = ' '.join(url_part).replace('-', ' ').capitalize()
                second_div = second_td.find('div').find_all('div')[1]
                date_value = None
                span_titles = row.find_all('span', title=True)
                for span in span_titles:
                    title_text = span['title']
                    if any(keyword in title_text for keyword in ["New posts.", "Hot thread.", "Closed thread"]):
                        thread_date_span = row.find('span', class_='forum-display__thread-date')
                        if thread_date_span:
                            date_value = thread_date_span.get_text(strip=True)
                            break
                if date_value is None:
                    last_post_span = row.find('span', class_='lastpost')
                    if last_post_span:
                        date_value = last_post_span.contents[0].strip()
                author_span = second_div.find('span', class_='author')
                author_name = author_span.find('a').find('span').get_text()
                author_url = author_span.find('a').get('href')
                third_td = cells[2]
                reply_a_tag = third_td.find('a')
                reply_count = reply_a_tag.get_text() if reply_a_tag else "No replies found"
                fourth_td = cells[3]
                views_count = fourth_td.get_text(strip=True)

                search_results.append({
                    'post_name': title,
                    'post_author': author_name,
                    'post_author_url': author_url,
                    'post_link': post_url,
                    'post_date': date_value,
                    'views': views_count,
                    'replies': reply_count
                })

    return search_results


def save_to_csv(data, filename):
    file_exists = Path(filename).exists()
    with open(filename, mode='a', newline='', encoding='utf-8') as file:
        writer = csv.DictWriter(file, fieldnames=['post_name', 'post_author', 'post_author_url', 'post_link', 'post_date', 'views', 'replies'])
        if not file_exists:
            writer.writeheader()  
        writer.writerows(data)


def main():
    csv_file = 'databases_extracted_data.csv'
    with sync_playwright() as p:
        browser = p.firefox.launch(headless=False, slow_mo=10000)
        context = browser.new_context(
            color_scheme='dark',
            viewport={'width': 1920, 'height': 968},
        )
        context.add_cookies(json.loads(Path("breach_cookies.json").read_text()))
        context.add_init_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
        page = context.new_page()
        page.goto('https://breachforums.st/Forum-Databases')
        while True:
            content = page.content()
            soup = bs4(content, 'html.parser')
            data = extract_table_data(soup)
            save_to_csv(data, csv_file)
            next_button = page.query_selector('a.pagination_next')
            if next_button and 'Next' in next_button.text_content():
                next_button.click()
                page.wait_for_load_state('networkidle')
            else:
                break

if __name__ == '__main__':
    main()
