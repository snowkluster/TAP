#!/usr/bin/env python3

from fastapi import FastAPI, Query
from pydantic import BaseModel
from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup as Bs4
import json
from pathlib import Path
from time import sleep

app = FastAPI()

class SearchResult(BaseModel):
    url: str
    text: str
    date: str
    replies: str
    views: str


def extract_table_data(page_content):
    response_list = []
    soup = Bs4(page_content, "html.parser")
    table = soup.find("table", {"id": "forum_table"})
    if table:
        rows = table.find_all("tr")
        for row in rows:
            row_dict = {}
            tds = row.find_all("td")
            second_td = tds[1]
            h4_element = second_td.find("h4")
            if h4_element:
                a_tag = h4_element.find("a")
                row_dict["url"] = a_tag["href"]
                row_dict["text"] = a_tag.text.strip()

                date_span = second_td.find("span", class_="desc lighter blend_links toggle_notify_off")
                if date_span:
                    date_text = date_span.get_text(strip=True)
                    _, second_part = date_text.split(",", 1)
                    row_dict["date"] = second_part.strip()

                fourth_td = tds[3]
                ul_element = fourth_td.find("ul")
                if ul_element:
                    li_elements = ul_element.find_all("li")
                    for idx, li in enumerate(li_elements):
                        if idx == 0:
                            row_dict["replies"] = li.text.strip()
                        elif idx == 1:
                            row_dict["views"] = li.text.strip()

                response_list.append(row_dict)

    return response_list

@app.get("/search/")
def search_nulled_forums(search_term: str = Query(...)):
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False,slow_mo=2351)
        context = browser.new_context()
        context.add_cookies(json.loads(Path("../json/cracked_cookies.json").read_text()))
        page = context.new_page()
        page.goto("https://cracked.sh/search.php")
        sleep(30)
        page.locator("[name='search_term']").fill(search_term)
        page.click("input.input_submit")

        all_responses = []

        while True:
            html_content = page.content()
            current_response = extract_table_data(html_content)
            all_responses.extend(current_response)

            next_page_button = page.query_selector("a[title='Next page']")
            if next_page_button:
                next_page_button.click()
                page.wait_for_load_state("networkidle")
            else:
                break

        browser.close()

    return all_responses

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8010)