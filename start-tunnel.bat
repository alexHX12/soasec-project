@echo off
docker compose -f docker-compose_cf.yaml down
cd soasec-blog
call ng build --configuration=production-tunnel
cd ../soasec-blog-area_riservata
call ng build --configuration=production-tunnel
cd ..
docker compose build
docker compose -f docker-compose_cf.yaml up -d