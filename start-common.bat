@echo off
docker compose down
cd soasec-blog
call ng build
cd ../soasec-blog-area_riservata
call ng build
cd ..
docker compose build
docker compose up -d