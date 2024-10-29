#!/bin/sh

Green="\e[32m"
Red="\033[0;31m"
NC='\033[0m'

IMAGE_NAME="tor-proxy"
CONTAINER_NAME="tor_instance"
TOR_PORT=9050

if [ "$1" = "stop" ]; then
    echo "${Red}Stopping Container${NC}"
    sudo docker stop $CONTAINER_NAME
    echo "${Red}Removing Container${NC}"
    sudo docker rm $CONTAINER_NAME
    exit 0
fi

echo "Building the Docker image..."
sudo docker build -t $IMAGE_NAME .

echo "Starting the Tor Proxy"
sudo docker run -d --name $CONTAINER_NAME -p $TOR_PORT:$TOR_PORT $IMAGE_NAME

echo "Tor service is now running in the container on port $TOR_PORT."