#!/usr/bin/env python3

import time
from playwright.sync_api import sync_playwright
from pathlib import Path
import json

with sync_playwright() as p:
    browser = p.firefox.launch(headless=True, slow_mo=1000)
    context = browser.new_context()
    page = context.new_page()
    page.goto("https://onniforums.com/member.php?action=login")
    page.wait_for_selector("form[action='member.php']")
    username_elements = page.query_selector_all("#username")
    if len(username_elements) > 1:
        ## Old Username : nigerian_prince_tang
        ## Old Password : zoXU5tVE3GmYowXm4d
        ## Old Old Username : zeptomax
        ## Old Old Password : y&^522AYtq^w7pgXDd
        second_username_input = username_elements[1]
        second_username_input.fill("just_another_retard")
    password_elements = page.query_selector_all("#password")
    if len(password_elements) > 1:
        second_password_input = password_elements[1]
        second_password_input.fill('53V~@L2U<L-M"L=s?5^vRJ!-m>xQ!d')
    login_buttons = page.query_selector_all("input[type='submit'][name='submit']")
    if len(login_buttons) > 1:
        second_login_button = login_buttons[1]
        second_login_button.click()
    cookies = context.cookies()
    Path("../../json/onni_cookies.json").write_text(json.dumps(cookies))
    browser.close()
