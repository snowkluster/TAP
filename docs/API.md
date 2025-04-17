## API Info
- All the APIs are found in the `api/` folder in the root directory
- In the below documentation `XXXX` is used to denote a user provided input

### breach_search_api.py
- `:8010/search/?search_term=XXXX` is the format of the API, it takes data for running the scrapper in the query string called search_term
- It returns data in the below format
    ```json
    [
        {
            "post_name": "Dubpay database and source code leaked",
            "author": "https://breachforums.st/User-Kinuzo",
            "post_link": "https://breachforums.st/Thread-COLLECTION-Dubpay-database-and-source-code-leaked?action=newpost",
            "replies": "5",
            "views": "181",
            "post_date": "8 hours ago"
        },
        {
            "post_name": "Pegasus NSO Android Variant",
            "author": "https://breachforums.st/User-Coloniza",
            "post_link": "https://breachforums.st/Thread-SOURCE-CODE-Pegasus-NSO-Android-Variant?action=newpost",
            "replies": "5",
            "views": "665",
            "post_date": "11-04-2024, 07:05 AM"
        },
        {
            "post_name": "Eagle Spy V3 (Android RAT) Source Code",
            "author": "https://breachforums.st/User-Adelia",
            "post_link": "https://breachforums.st/Thread-Eagle-Spy-V3-Android-RAT-Source-Code?action=newpost",
            "replies": "13",
            "views": "1,115",
            "post_date": "10-23-2024, 03:58 PM"
        }
    ]
    ```
- It uses the default search function of the site to run the query and then scrapes the data from the results page
- the live scraper uses beautifulsoup and playwright to collect data from the site

### doxbin_search_api.py
- `:8002/search/?search_term=XXXX` is the format of the API, it takes data for running the scrapper in the query string called search_term
- It returns data in the below format
    ```json
    [
        {
            "Title": "kalatre gomme femboy",
            "Title_url": "https://doxbin.net/upload/kalatregommefemboy",
            "Comments": "0",
            "Views": "421",
            "Created_by": "pedophil",
            "Added": "Feb 2nd, 2025"
        },
        {
            "Title": "roblox dahood pedo (he cant dox)",
            "Title_url": "https://doxbin.net/upload/robloxdahoodpedohecantdox",
            "Comments": "1",
            "Views": "516",
            "Created_by": "connoisseur",
            "Added": "Feb 2nd, 2025"
        },
        {
            "Title": "robloxians lmao",
            "Title_url": "https://doxbin.net/upload/robloxianslmao",
            "Comments": "3",
            "Views": "438",
            "Created_by": "connoisseur",
            "Added": "Feb 2nd, 2025"
        },
        {
            "Title": "@stukach_stukach",
            "Title_url": "https://doxbin.net/upload/stukachstukach",
            "Comments": "1",
            "Views": "298",
            "Created_by": "WhiteGloves",
            "Added": "Feb 2nd, 2025"
        },
        {
            "Title": "Reset the wannabe extorter",
            "Title_url": "https://doxbin.net/upload/Resetthewannabeextorter",
            "Comments": "41",
            "Views": "594",
            "Created_by": "lncognito[Rich]",
            "Added": "Feb 2nd, 2025"
        }
    ]
    ```
- It uses the default search function of the site to run the query and then scrapes the data from the results page
- the live scraper uses beautifulsoup and playwright to collect data from the site and uses FastAPI for the API creation

### combine_search.py
- `:8000/search/?search_term=XXXX` is the format of the API, it takes data for running the scrapper in the query string called search_term
- It is used to perform combined live search on two APIs with a single endpoint
- The users calls the single combined search API endpoint and then the API recursively calls the subsequent API and then collects and sorts the results for easier analysis
- The combined endpoint also checks if the APIs are live or not and does error handling
- It returns data in the below format
    ```json
    {
    "successful": {
            "breachforums": [
                {
                    "post_name": "Pegasus NSO Android Variant",
                    "author": "https://breachforums.st/User-Coloniza",
                    "post_link": "https://breachforums.st/Thread-SOURCE-CODE-Pegasus-NSO-Android-Variant?action=newpost",
                    "replies": "5",
                    "views": "665",
                    "post_date": "11-04-2024, 07:05 AM"
                },
                {
                    "post_name": "Eagle Spy V3 (Android RAT) Source Code",
                    "author": "https://breachforums.st/User-Adelia",
                    "post_link": "https://breachforums.st/Thread-Eagle-Spy-V3-Android-RAT-Source-Code?action=newpost",
                    "replies": "13",
                    "views": "1,115",
                    "post_date": "10-23-2024, 03:58 PM"
                }
                ],
                "doxbin": [
                {
                    "Title": "roblox dahood pedo (he cant dox)",
                    "Title_url": "https://doxbin.net/upload/robloxdahoodpedohecantdox",
                    "Comments": "1",
                    "Views": "516",
                    "Created_by": "connoisseur",
                    "Added": "Feb 2nd, 2025"
                },
                {
                    "Title": "robloxians lmao",
                    "Title_url": "https://doxbin.net/upload/robloxianslmao",
                    "Comments": "3",
                    "Views": "438",
                    "Created_by": "connoisseur",
                    "Added": "Feb 2nd, 2025"
                }
            ]
        },
    "failed": {}
    }
    ```
- The below is an example of a failed request
    ```json
    {
    "successful": {
        "doxbin": [
            {
                "Title": "roblox dahood pedo (he cant dox)",
                "Title_url": "https://doxbin.net/upload/robloxdahoodpedohecantdox",
                "Comments": "1",
                "Views": "516",
                "Created_by": "connoisseur",
                "Added": "Feb 2nd, 2025"
            }
        ]
    },
    "failed": {
        "breachforums": "Failed to connect to breachforums at http://localhost:8010/search/, ConnectError(...)"
    }
    }
    ```

### filehash-virus.py
- `:8006/check/XXXX` is the format of the API, it takes data (file hash) as the path varieble in the request
- The provided hash needs to be sha1, sha256, md5
- It then takes the file hash and calls the virustotal API to get further details about the file hash
- the API then formats the virustotal data, stripping out the useless parts
- It returns data in the below format
    ```json
    {
    "type": null,
    "type_tags": [
        "executable",
        "windows",
        "win32",
        "pe",
        "pedll"
    ],
    "size": 184320,
    "meaningful_name": "FannyWorm_D8A7AAD5247B224246DC79BACBBF3105",
    "reputation": -56,
    "md5": "d8a7aad5247b224246dc79bacbbf3105",
    "sha1": "d66c402db92d41845f5abee09d34f066706f9d7a",
        "last_analysis_stats": {
            "malicious": 67,
            "suspicious": 0,
            "undetected": 5,
            "harmless": 0,
            "timeout": 0,
            "confirmed-timeout": 0,
            "failure": 1,
            "type-unsupported": 4
        }
    }
    ```
- If the filehash already exists within the virustotal database the requests take about ~8 seconds however if it does not exists within the database the request can take upto ~20 seconds
- The API is written in Fast API

### IOC.py
- `:8008/` is the format of the API
- It does not take any user input add just gets the latest dark web IOC from malware bazaar and threat fox that are part of the abuse.ch system
- It returns data in the below format
    ```json
    [
        {
            "sha3_384_hash": "9d80850a5f92e77f9b24b829ec548e68af897b90089125d35c4f1ad894dca217b6a6d5f05252b43ee7031ac3a7293935",
            "sha256_hash": "62c78826159ab95695740cf00c1a48b7365048a8db6556fe6b272dcd1796c1d6",
            "sha1_hash": "fdc905957d246225f4253d80c7a95408305ea133",
            "md5_hash": "f1d068c56f6023fb25a4f4f0cc02e9a1",
            "first_seen": "2025-04-17 11:03:33",
            "origin_country": "HU",
            "file_size": 414720,
            "file_type_mime": "application/x-dosexec",
            "intelligence": {
            "clamav": null,
            "downloads": "125",
            "uploads": "1",
            "mail": null
            },
            "tags": [
            "dll",
            "TookPS"
            ],
            "file_name": "mal.dll",
            "IOC Name": "dll"
        },
        {
            "sha3_384_hash": "91bc22cbcbb413a77adf9ccc02f0b2603ce7b3e9552e700e792757cf4874a71f9bdccd977faa462b083b9503512a81b2",
            "sha256_hash": "ccf5526629b694efc729f43bc05326dadb771c41665540c75e6ae423af4421aa",
            "sha1_hash": "e9196b79a0e7ea38894ce117343d3b302bf7c71d",
            "md5_hash": "2474ef334834bc5e40f9b69bf550afc8",
            "first_seen": "2025-04-17 10:59:40",
            "origin_country": "DE",
            "file_size": 50318,
            "file_type_mime": "application/x-executable",
            "intelligence": {
            "clamav": null,
            "downloads": "41",
            "uploads": "1",
            "mail": null
            },
            "tags": [
            "elf"
            ],
            "file_name": ".i",
            "IOC Name": "UNKNOWN"
        }
    ]
    ```

### ip_rep.py
- `:8004/check_ip?ip=XXXX` is the format of the API, the IP query string needs to be set by user to IP they want to check
- the API then passes this data to the 9 different blocklists that are checked against
- These blocklists are maintained by governments and massive corporations 
- these lists are 
  - https://isc.sans.edu/ipsascii.html
  - https://www.spamhaus.org/drop/drop.txt
  - https://redlist.redstout.com/redlist.txt
  - https://rules.emergingthreats.net/blockrules/compromised-ips.txt
  - http://reputation.alienvault.com/reputation.data
  - https://raw.githubusercontent.com/stamparm/ipsum/refs/heads/master/ipsum.txt
  - https://www.blocklist.de/lists/all.txt
  - https://www.blocklist.de/lists/apache.txt
  - https://threatview.io/Downloads/IP-High-Confidence-Feed.txt
- the API returns data in the below format
    ```json
    {
    "ip": "218.92.0.112",
    "blocklist_count": 4,
    "blocklists": {
        "ISC SANS": false,
        "Spamhaus DROP": true,
        "RedStout RedList": true,
        "Emerging Threats": false,
        "AlienVault": false,
        "IPsum": true,
        "Blocklist.de": true,
        "Blocklist.de Apache": false,
        "ThreatView": false
    },
    "is_malicious": true
    }
    ```
- these blocklists are updated at a regular interval of ~2 days 

### latest_ransomware_post_api.py
- `:8009/scrape` is the format of the API, the API does not take any user input
- it collects data from ransomwatch.telemetry which is a community maintained project to monitor ransomware gang activities
- The API is written using Fast API
- it returns data in the below format
    ```json
    [
        {
            "date": "2025-04-17",
            "title": "Feldman & Lopez",
            "group_url": "https://ransomwatch.telemetry.ltd/#/profiles?id=lynx"
        },
        {
            "date": "2025-04-17",
            "title": "Hyalogic",
            "group_url": "https://ransomwatch.telemetry.ltd/#/profiles?id=lynx"
        },
        {
            "date": "2025-04-17",
            "title": "VIÑUELAS ABOGADOS",
            "group_url": "https://ransomwatch.telemetry.ltd/#/profiles?id=spacebears"
        }
    ]
    ```
- The data on this is also regularly updated

### nulled_search_api.py
- `:8030/search/?search_term=XXXX` is the format of the API, it takes data for running the scrapper in the query string called search_term
- It returns data in the below format
    ```json
    [
        {
            "url": "https://www.nulled.to/topic/1651833-free-anime-crunch-roll-megafan-acc/",
            "text": "FREE ANIME! CRUNCH ROLL MEGAFAN ACC!",
            "date": "10:52 AM",
            "replies": "31",
            "views": "1"
        },
        {
            "url": "https://www.nulled.to/topic/1011601-create-a-working-edu-student-email-works-for-azure-amazon-aws-etc-working-2020-feb/",
            "text": "CREATE A WORKING .EDU STUDENT EMAIL [Works for AZURE, AMAZON, AWS ETC!] [WORKING 2020 FEB]",
            "date": "10:48 AM",
            "replies": "2",
            "views": "2858"
        },
        {
            "url": "https://www.nulled.to/topic/1648862-✨-1k-fresh-email-full-access-accounts✨/",
            "text": "✨ 1k Fresh Email FUll Access accounts✨",
            "date": "10:46 AM",
            "replies": "2",
            "views": "102"
        },
        {
            "url": "https://www.nulled.to/topic/1650751-100x-hotmail-france-accounts-⚡capture-valid-private-100-working-fa-inbox-⚡⭐️/",
            "text": "100X HOTMAIL FRANCE ACCOUNTS ⚡CAPTURE VALID PRIVATE 100% WORKING FA INBOX ⚡⭐️",
            "date": "10:45 AM",
            "replies": "2",
            "views": "16"
        }
    ]
    ```
- It uses the default search function of the site to run the query and then scrapes the data from the results page
- the live scraper uses beautifulsoup and playwright to collect data from the site
- *Note: Due to project talent taking down nulled and cracked this API does not work*

### onni_search_api.py
- `:8040/search/?search_term=XXXX` is the format of the API, it takes data for running the scrapper in the query string called search_term
- It returns data in the below format
    ```json
    [
        {
            "post_title": "Wouldn't I get caught?",
            "author_url": "https://onniforums.com/user-50810.html",
            "thread_url": "https://onniforums.com/thread-6363.html",
            "post_link": "https://onniforums.com/thread-6363.html",
            "replies": "160",
            "views": "1",
            "date_posted": "SaintsBunny10-18-2024"
        },
        {
            "post_title": "How do I make money online illegally?",
            "author_url": "https://onniforums.com/user-52213.html",
            "thread_url": "https://onniforums.com/thread-6246.html",
            "post_link": "https://onniforums.com/thread-6246.html",
            "replies": "888",
            "views": "8",
            "date_posted": "10Galaxy10-17-2024"
        },
        {
            "post_title": "How to sign an exe file to dodge Windows defender",
            "author_url": "https://onniforums.com/user-52737.html",
            "thread_url": "https://onniforums.com/thread-6326.html",
            "post_link": "https://onniforums.com/thread-6326.html",
            "replies": "381",
            "views": "2",
            "date_posted": "Mvko10-12-2024"
        }
    ]
    ```
- It uses the default search function of the site to run the query and then scrapes the data from the results page
- the live scraper uses beautifulsoup and playwright to collect data from the site
- *Note: Due to project talent taking down nulled and cracked this API does not work*

### Go Lang APIs
- The IOC and Filehash API that make uses of the malware bazaar, threatfox and the virustotal database have been ported from python3 Fast API to Golang based Gin framework
- The APIs are now much faster and have better error handling due to the Golang build system