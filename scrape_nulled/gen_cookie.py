#!/usr/bin/env python3

from playwright.sync_api import sync_playwright
import time
from pathlib import Path
import json

with sync_playwright() as p:
    browser = p.firefox.launch(headless=False, slow_mo=10000)
    context = browser.new_context()
    page = context.new_page()
    page.goto("https://www.nulled.to/index.php?app=core&module=global&section=login")
    page.fill('input#ips_username','zaptomax')
    page.fill('input#ips_password','QbE^@E@2QAHGRo')
    page.click('input.input_submit')
    time.sleep(5)
    cookies = context.cookies()
    Path("cookies.json").write_text(json.dumps(cookies))
    browser.close()