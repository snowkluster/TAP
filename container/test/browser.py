#!/usr/bin/env python3

from playwright.sync_api import sync_playwright
from time import sleep

with sync_playwright() as p:
    browser = p.firefox.launch(slow_mo=10000,headless=False,proxy={"server": "socks5://127.0.0.1:9050"})
    page = browser.new_page()
    sleep(1000)