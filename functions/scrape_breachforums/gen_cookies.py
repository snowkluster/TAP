#!/usr/bin/env python3


import json
from pathlib import Path
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.firefox.launch(headless=False, slow_mo=1000)
    context = browser.new_context()
    page = context.new_page()
    page.goto("https://breachforums.st/member?action=login")
    page.fill('input[name=username]','tempmax254')
    page.fill('input[name=password]','#UWqUhhXiArt6ubsn4xuc&@L')
    page.click('input[type="submit"].button[value="Login"]')
    cookies = context.cookies()
    Path("../../json/breach_cookies.json").write_text(json.dumps(cookies))
    browser.close()
