#!/bin/sh

kill "$(lsof -t -i:3000)"
kill "$(lsof -t -i:3001)"
kill "$(lsof -t -i:8000)"
kill "$(lsof -t -i:8003)"
kill "$(lsof -t -i:8002)"
kill "$(lsof -t -i:8006)"
kill "$(lsof -t -i:8004)"
kill "$(lsof -t -i:8008)"
kill "$(lsof -t -i:8009)"
kill "$(lsof -t -i:9000)"