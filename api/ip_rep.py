from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import re
import requests
import ipaddress

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://portal.localhost"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class IPCheckResult(BaseModel):
    ip: str
    blocklist_count: int
    blocklists: dict
    is_malicious: bool

def get_page_content(url):
    try:
        response = requests.get(url)
        if response.status_code == 200:
            return response.text
        else:
            return None
    except Exception:
        return None

def is_valid_ip(ip_address):
    try:
        ipaddress.ip_address(ip_address)
        return True
    except ValueError:
        return False

def is_ip_on_page(ip_address, page_content):
    ip_pattern = re.compile(r'\b' + re.escape(ip_address) + r'\b')
    return ip_pattern.search(page_content) is not None

def is_ip_in_spamhaus_list(ip_address, spamhaus_content):
    ip_obj = ipaddress.ip_address(ip_address)
    for line in spamhaus_content.splitlines():
        line = line.strip()
        if line.startswith(";") or not line:
            continue
        ip_range = line.split(" ;")[0]
        try:
            network = ipaddress.ip_network(ip_range, strict=False)
            if ip_obj in network:
                return True
        except ValueError:
            continue
    return False

def split_malformed_ip(malformed_ip):
    ip_parts = []
    current_segment = ""
    for char in malformed_ip:
        if char.isdigit():
            current_segment += char
        elif char == '.':
            if current_segment:
                ip_parts.append(current_segment)
            current_segment = ""
    if current_segment:
        ip_parts.append(current_segment)
    valid_ip_parts = []
    for part in ip_parts:
        if part.isdigit() and 0 <= int(part) <= 255:
            valid_ip_parts.append(part)
    return valid_ip_parts

def is_ip_in_redlist(ip_address, redlist_content):
    ip_obj = ipaddress.ip_address(ip_address)
    for line in redlist_content.splitlines():
        line = line.strip()
        if line.startswith("# line") or not line:
            continue
        try:
            if "/" in line:
                network = ipaddress.ip_network(line, strict=False)
                if ip_obj in network:
                    return True
            else:
                redlist_ip = ipaddress.ip_address(line)
                if ip_obj == redlist_ip:
                    return True
        except ValueError:
            if len(line) > 15:
                parts = split_malformed_ip(line)
                for part in parts:
                    try:
                        if "/" in part:
                            network = ipaddress.ip_network(part, strict=False)
                            if ip_obj in network:
                                return True
                        else:
                            redlist_ip = ipaddress.ip_address(part)
                            if ip_obj == redlist_ip:
                                return True
                    except ValueError:
                        continue
    return False

def is_ip_in_alienvault_list(ip_address, alienvault_content):
    for line in alienvault_content.splitlines():
        parts = line.split('#')
        if len(parts) > 0 and parts[0] == ip_address:
            return True
    return False

def is_ip_in_emerging_threats_list(ip_address, emerging_content):
    ip_obj = ipaddress.ip_address(ip_address)
    for line in emerging_content.splitlines():
        line = line.strip()
        try:
            emerging_ip = ipaddress.ip_address(line)
            if ip_obj == emerging_ip:
                return True
        except ValueError:
            continue
    return False

def is_ip_in_ipsum_list(ip_address, ipsum_content):
    for line in ipsum_content.splitlines():
        line = line.strip()
        if line.startswith("#"):
            continue
        parts = line.split("\t")
        if len(parts) > 0 and parts[0] == ip_address:
            return True
    return False

def is_ip_in_blocklist_de_list(ip_address, blocklist_content):
    for line in blocklist_content.splitlines():
        line = line.strip()
        if line == ip_address:
            return True
    return False

def is_ip_in_apache_list(ip_address, apache_content):
    for line in apache_content.splitlines():
        line = line.strip()
        if line == ip_address:
            return True
    return False

def is_ip_in_threatview_list(ip_address, threatview_content):
    for line in threatview_content.splitlines():
        line = line.strip()
        if line == ip_address:
            return True
    return False

@app.get("/check_ip", response_model=IPCheckResult)
async def check_ip(ip: str):
    if not is_valid_ip(ip):
        raise HTTPException(status_code=400, detail="Invalid IP address")

    blocklist_results = {}
    blocklist_count = 0
    ## Test IP : 218.92.0.112
    url_isc = 'https://isc.sans.edu/ipsascii.html'
    url_spamhaus = 'https://www.spamhaus.org/drop/drop.txt'
    url_redlist = 'https://redlist.redstout.com/redlist.txt'
    url_emerging = 'https://rules.emergingthreats.net/blockrules/compromised-ips.txt'
    url_alienvault = 'http://reputation.alienvault.com/reputation.data'
    url_ipsum = 'https://raw.githubusercontent.com/stamparm/ipsum/refs/heads/master/ipsum.txt'
    url_blocklist_de = 'https://www.blocklist.de/lists/all.txt'
    url_apache = 'https://www.blocklist.de/lists/apache.txt'
    url_threatview = 'https://threatview.io/Downloads/IP-High-Confidence-Feed.txt'


    page_content_isc = get_page_content(url_isc)
    if page_content_isc and is_ip_on_page(ip, page_content_isc):
        blocklist_results["ISC SANS"] = True
        blocklist_count += 1
    else:
        blocklist_results["ISC SANS"] = False

    spamhaus_content = get_page_content(url_spamhaus)
    if spamhaus_content and is_ip_in_spamhaus_list(ip, spamhaus_content):
        blocklist_results["Spamhaus DROP"] = True
        blocklist_count += 1
    else:
        blocklist_results["Spamhaus DROP"] = False

    redlist_content = get_page_content(url_redlist)
    if redlist_content and is_ip_in_redlist(ip, redlist_content):
        blocklist_results["RedStout RedList"] = True
        blocklist_count += 1
    else:
        blocklist_results["RedStout RedList"] = False

    emerging_content = get_page_content(url_emerging)
    if emerging_content and is_ip_in_emerging_threats_list(ip, emerging_content):
        blocklist_results["Emerging Threats"] = True
        blocklist_count += 1
    else:
        blocklist_results["Emerging Threats"] = False

    alienvault_content = get_page_content(url_alienvault)
    if alienvault_content and is_ip_in_alienvault_list(ip, alienvault_content):
        blocklist_results["AlienVault"] = True
        blocklist_count += 1
    else:
        blocklist_results["AlienVault"] = False

    ipsum_content = get_page_content(url_ipsum)
    if ipsum_content and is_ip_in_ipsum_list(ip, ipsum_content):
        blocklist_results["IPsum"] = True
        blocklist_count += 1
    else:
        blocklist_results["IPsum"] = False

    blocklist_de_content = get_page_content(url_blocklist_de)
    if blocklist_de_content and is_ip_in_blocklist_de_list(ip, blocklist_de_content):
        blocklist_results["Blocklist.de"] = True
        blocklist_count += 1
    else:
        blocklist_results["Blocklist.de"] = False

    apache_content = get_page_content(url_apache)
    if apache_content and is_ip_in_apache_list(ip, apache_content):
        blocklist_results["Blocklist.de Apache"] = True
        blocklist_count += 1
    else:
        blocklist_results["Blocklist.de Apache"] = False

    threatview_content = get_page_content(url_threatview)
    if threatview_content and is_ip_in_threatview_list(ip, threatview_content):
        blocklist_results["ThreatView"] = True
        blocklist_count += 1
    else:
        blocklist_results["ThreatView"] = False
    
    is_malicious = blocklist_count > 2

    result = IPCheckResult(
        ip=ip,
        blocklist_count=blocklist_count,
        blocklists=blocklist_results,
        is_malicious=is_malicious
    )

    return result

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8004)
