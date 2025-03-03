#!/bin/sh

Green="\e[32m"
Red="\033[0;31m"
NC='\033[0m'

if [ "$1" = "stop" ]; then
    echo "${Red}Stopping All Containers${NC}"
    sudo docker compose down --rmi local
    echo "${Red}Stopping Dashboard${NC}"
    kill "$(lsof -t -i:3000)"
    kill "$(lsof -t -i:3001)"
    echo "${Red}Stopping APIs${NC}"
    kill "$(lsof -t -i:8000)"
    kill "$(lsof -t -i:8003)"
    kill "$(lsof -t -i:8002)"
    kill "$(lsof -t -i:8006)"
    kill "$(lsof -t -i:8004)"
    kill "$(lsof -t -i:8008)"
    kill "$(lsof -t -i:8009)"
    echo "${Red}Stopping Middlewares${NC}"
    kill "$(lsof -t -i:9000)"
    echo "${Red}Stopping Main Site${NC}"
    kill "$(lsof -t -i:5173)"
    exit 0
fi

echo "${Green}Starting Admin Panel${NC}"

cd admin/frontend || exit

npm run dev &

cd ../backend || exit

node app.js &

cd ../.. || exit

echo "${Green}Starting API's${NC}"

cd api || exit

./starter.sh &

cd .. || exit

echo "${Green}Starting Middleware${NC}"

cd middleware || exit

python3 api.py &

cd .. || exit

echo "${Green}Starting Main Site${NC}"

cd frontend || exit

npm run dev &

echo "${Green}Starting All Containers${NC}"
sudo docker compose up -d

cd ..