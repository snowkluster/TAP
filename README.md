# Threat Analysis Platform (TAP)

![GitLeaks](https://img.shields.io/badge/protected%20by-gitleaks-blue)
[![License](https://img.shields.io/github/license/snowkluster/tap)](./LICENSE)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Build Status](https://img.shields.io/github/actions/workflow/status/snowkluster/TAP/main.yml)
![Docker](https://img.shields.io/badge/docker-ready-brightgreen)
![Python](https://img.shields.io/badge/python-3.11%2B-blue)
![Go](https://img.shields.io/badge/go-1.21%2B-blue)
![Node.js](https://img.shields.io/badge/node.js-22%2B-green)
![NGINX](https://img.shields.io/badge/nginx-latest-green)
![PostgreSQL](https://img.shields.io/badge/postgresql-latest-blue)

TAP provides analyst access to multiple cyber crime forums in a single *TAP* allowing them to streamline their threat intelligence and data collection capabities, TAP provides access to multiple cyber crime forums, ransomware gang sites over TOR, doxxing and hate platforms in form search API's and scraped data that be can used to quickly form correlation between different threat actor movements and discussions.

A comprehensive cybersecurity intelligence platform that aggregates, analyzes, and provides searchable access to data from various sources including dark web forums, breach databases, and ransomware posts.

**Note The documentation of this project is still under work and will be updated accordingly**

## Overview

TAP is designed to help security professionals monitor and analyze cyber threats by collecting and indexing data from multiple sources:

- Breach database leaks 
- Doxbin records
- Nulled forum data
- OnniForums intelligence
- Cracked accounts and combos
- Ransomware group activities
- IOC (Indicators of Compromise) checking
- IP reputation analysis
- File hash verification

The platform provides both a web interface for interactive searches and API endpoints for integration with other security tools.

## Architecture

The system consists of multiple components:

- **Frontend**: React-based UI with Tailwind CSS and Material UI
- **Admin Panel**: Management interface for system administration
- **APIs**: Python and Go services for data retrieval and processing
- **Container**: Dockerized environment for dark web scraping
- **Database**: PostgreSQL database for storing indexed data
- **Data Loaders**: Scripts to collect and process data
- **NGINX**: Reverse proxy for routing traffic to different services
- **Docker**: Containerization for easy deployment and scaling

### System Architecture

![System Design](./images/System%20Design.png)

## Dataset
You can download the data that has already been scraped by the platform at [kaggle.com/snowkluster](https://www.kaggle.com/datasets/snowkluster/dark-web-posts/data)

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js 22+
- Python 3.11+
- Go 1.21+

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/snowkluster/TAP.git
    cd TAP
    ```

2. Start dashboard frontend:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

3. Start admin panel [frontend]:
    ```bash
    cd admin/frontend
    npm install
    npm run dev
    ```

4. Start admin panel [backend]:
    ```bash
    cd admin/backend
    npm install
    node app.js
    ```

5. Start API:
    ```bash
    pip install -r requirements.txt
    cd api
    ./build.sh
    ./starter.sh
    ```

6. Start the platform using Docker Compose:
   ```bash
   ./start.sh
   ```

7. Access the services:
   - Main Portal: http://portal.localhost
   - Admin Dashboard: http://dashboard.localhost

### Docker Configuration

The project uses Docker Compose to orchestrate multiple services:

- **NGINX**: Reverse proxy for routing traffic
- **PostgreSQL**: Database for storing collected data
- **SQLite**: Database for backup storage incase of failure of PSQL Database

The `compose.yml` file defines these services and their configurations.

### Networking

The platform uses two networking approaches:
- **Host Network**: For the NGINX service, allowing direct access to localhost services
- **Bridge Network**: For the database and other services, providing container isolation

### Development Setup

For frontend development:
```bash
cd frontend
npm install
npm run dev
```

For admin panel development [frontend]:
```bash
cd admin/frontend
npm install
npm run dev
```

For admin panel development [backend]:
```bash
cd admin/backend
npm install
node app.js
```

For API development:
```bash
cd api
./build.sh
./starter.sh
```

## Features

- **Live Search**: Query across multiple data sources
- **Breach Search**: Find compromised credentials
- **Darknet Feed**: Monitor latest dark web activities
- **Ransomware Post Tracking**: Stay updated on ransomware group activities
- **IP & Hash Analysis**: Check reputation and malware indicators
- **Cybersecurity News**: Latest updates from the security community

## API Documentation

The platform provides several API endpoints:

- `:8010/search/"`: Search breached forums for records
- `:8002/search/`: Search doxbin forums for records
- `:8013/search/`: Search nulled forums for records
- `:8014/search/`: Search OnniForums forums for records
- `8004:/check_ip/?ip=:<IP_ADDR>`: Check IP reputation
- `8006:/check/:<FILE_HASH>`: Verify file hashes and reputation
- `8009:/scrape/`: Get latest ransomware posts
- `:8008/`: Check indicators of compromise

For further details look at [API Docs](./docs/API.md)

## Server Configuration

### NGINX

The platform uses NGINX as a reverse proxy to route traffic to different services:

- `portal.localhost` routes to the main frontend application
- `dashboard.localhost` routes to the admin dashboard

The NGINX configuration is stored in `public/nginx.conf` and is mounted into the NGINX container.

### Database

PostgreSQL is used as the primary database with the following configuration:

- **Username**: dbuser
- **Database**: darkweb
- **Port**: 5432

Data persistence is managed via Docker volumes.

## Maintenance

### Cleaning Scripts

The repository includes several utility scripts:
- `clean.sh`: General cleanup
- `clean-api.sh`: API-specific cleanup
- `wlc.sh`: Welcome script

## Security

This platform is designed for legitimate security research and threat intelligence purposes only. See [SECURITY.md](SECURITY.md) for security policies and responsible usage guidelines.

## Contributing

Contributions are welcome! Please check the [TODO.md](TODO.md) file for areas that need help. Follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


## Authors

- [@snowkluster](https://www.github.com/snowkluster)
- [@aparna2573](https://github.com/aparna2573)
- [@geetansh14](https://github.com/geetansh14)
