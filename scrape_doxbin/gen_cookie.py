#!/usr/bin/env python3

from playwright.sync_api import sync_playwright
from time import sleep
import json
from pathlib import Path

with sync_playwright() as p:
    browser = p.firefox.launch(headless=False,slow_mo=10000)
    context = browser.new_context()
    page = context.new_page()
    page.goto("https://doxbin.org/login")
    sleep(15)
    page.fill('input#username','dump_master345')
    page.fill('input#password','Zxqz33FmFbijeA')
    page.click('input[value="Login"]')
    cookies = context.cookies()
    Path("cookies.json").write_text(json.dumps(cookies))