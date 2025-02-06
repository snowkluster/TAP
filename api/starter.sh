#!/bin/sh

#uvicorn breach_search_api:app --reload --host 0.0.0.0 --port 8001 &
#pid1=$!
uvicorn doxbin_search_api:app --reload --host 0.0.0.0 --port 8002 &
pid2=$!
uvicorn nulled_search_api:app --reload --host 0.0.0.0 --port 8003 &
pid3=$!
python3 ip_rep.py &
pid4=$!
python3 IOC.py &
pid5=$!
python3 filehash-virus.py &
pid6=$!
python3 combine_search.py &
pid7=$!
trap 'kill $pid2 $pid3 pid4 pid5 pid6 pid7' INT
wait $pid2 $pid3 $pid4 $pid5 $pid6 $pid7
