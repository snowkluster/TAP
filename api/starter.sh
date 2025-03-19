#!/bin/sh

#uvicorn breach_search_api:app --reload --host 0.0.0.0 --port 8001 &
#pid1=$!
uvicorn doxbin_search_api:app --host 0.0.0.0 --port 8002 &
pid2=$!
python3 breach_search_api.py &
pid3=$!
python3 ip_rep.py &
pid4=$!
./main &
pid5=$!
python3 combine_search.py &
pid7=$!
python3 latest_ransom_post_api.py &
pid8=$!
trap 'kill $pid2 $pid3 pid4 pid5 pid7 pid8' INT
wait $pid2 $pid3 $pid4 $pid5 $pid7 $pid8
