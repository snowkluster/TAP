## Creating accounts
- Since all the scrappers (live and storing) require user account cookies, it is a requirement to be able to use these platform.
- To start creating account firstly make a temp mail using a email service provider such as tutanota or protonmail
- make sure that these accounts are not related to you in anyway possible
- the second step would be to create a strong password for this use KeepassXC or bitwarden to generate strong passwords that are not used in any other account
- After successfully registering your account with a secure email provider, you can start generating users cookies that will be used by the scrappers

## Cookie Generation
- Inside the functions there are all the scrappers that the platform uses such as breachforums, cracked, nulled, onniforums, doxbin
- Within each folder there is a file called `gen_cookies.py`
- each `gen_cookies.py` files corresspondes to a particular site, so you would need to run a total of five scripts for this platform to work
- When you run each file `python3 gen_cookies.py` it would open up the site in a scrapper browser that is powered by playwright 
- Using this browser follow the steps to create an account like on any other website
- Make sure to use the secure email that you have created in the first step.
- After the account has been created and you are logged into the site, just wait for the browser to close automatically
- Your cookies that are related to your account would have been saved in the `json/` folder found in the root directory
- remember that you cookies have an expiration date and you would need to repeat the above steps every `366 days`

## Types of Scrappers
- The platform has two types of scrapper the storing scrappers and live scrappers 
- the storing scrappers that found inside the `functions/` folder
- There are child folder for each site, that has its own storing scrappers 
- the directory structure is given below
    ```sh
    .
    ├── scrape_breachforums
    │   └── pages
    ├── scrape_cracked
    │   ├── auth
    │   ├── error
    │   └── pages
    ├── scrape_doxbin
    │   ├── pages
    │   └── test
    ├── scrape_nulled
    └── scrape_onniforums
    ```
- you need to manually start each scrapper using `python3`
- the scraper will collect the data from the respective site and then store it in the `database/` folder in the `.csv` files
- the files have the following naming convention `{FORUM_NAME}_{SCOPE_NAME}.csv`
- here the `FORUM_NAME` is the name of the cybercriminal forum and the `SCOPE_NAME` is the name of section of the forum that the scrapper collected data from
- You can then use the provided python script in the `database/` folder to convert all the `.csv` files into a SQLite db named `output.db`
- This database acts like a backup database since the primary database is a Postgres Database that is running inside a Docker container and to make sure that the database is persisted and to help with regeneration of containers it uses a docker volume called `major_postgres_data`
- To convert the data stored in the SQLite database you have run the `data_loader.py` script in the root folder
- Make sure the that docker container for the Postgres instance is running and health before executing this script
- The second type of scrapers that are used in this platform are called live scrapper such scraper can be found in the `api/` folder
- These are the scrapper that use the search APIs built using Fast API
- These live scrapper are 
  - `nulled_search_api.py`
  - `onni_search_api.py`
  - `doxbin_search_api.py`
  - `breach_search_api.py`
- the APIs have the file convention of `{FORUM_NAME}_search_api.py`
- they are all Fast API scripts that take the user input provide to them via the API and then pass it on to the playwright scrapper
- After the scrapper returns data to the script then it is formated into json and its results are returned via the API
