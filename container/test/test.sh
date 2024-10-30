#!/bin/sh

Green="\e[32m"
Red="\033[0;31m"
NC='\033[0m'

response=$(curl --socks5 127.0.0.1:9050 -s https://check.torproject.org/api/ip)

# Check if the response indicates that you are using Tor
if echo "$response" | jq -e '.IsTor' | grep -q 'true'; then
    echo "${Green}Connection Stable, Proxy Working${NC}"
else
    echo "${Red}Not connected to Tor or Proxy Failed${NC}"
fi
