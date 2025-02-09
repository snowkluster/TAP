#!/bin/sh

Green="\e[32m"
Red="\033[0;31m"
NC='\033[0m'

if [ "$1" = "stop" ]; then
    echo "${Red}Stopping All Containers${NC}"
    sudo docker compose down --rmi local
    echo "${Red}Stopping Dashboard${NC}"
    # kill "$(lsof -t -i:3000)"
    exit 0
fi

cd admin || exit

echo "${Green}Starting All Containers${NC}"
sudo docker compose up -d

cd ..