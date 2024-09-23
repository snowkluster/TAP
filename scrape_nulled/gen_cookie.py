#!/usr/bin/env python3

from playwright.sync_api import sync_playwright
import json
from pathlib import Path
from time import sleep

with sync_playwright() as p:
    browser = p.firefox.launch(headless=False,slow_mo=10000)
    context = browser.new_context()
    page = context.new_page()
    page.goto("https://www.nulled.to/")
    page.click('#sign_in')
    sleep(4)
    browser.close()