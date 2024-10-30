#!/bin/sh

Green="\e[32m"
Red="\033[0;31m"
NC='\033[0m'

echo "${Green}Cleaning None Images${NC}"
sudo docker rmi $(sudo docker images -f "dangling=true" -q)