1. как запустить frontend:

a. Построить image docker
docker build -t frontend-app .

b. Запустить контейнер
docker run -d -p 4000:80 --name web-frontend frontend-app
frontend доступен по адресу "http://localhost:4000"

2. как запустить backend:

a. backend/auth-service
- docker compose up
доступен по адресу "http://localhost:3000/api/auth"

b. backend/food-service
- docker compose up
доступен по адресу "http://localhost:3200/api/food"

c. backend/order-service
- docker compose up
доступен по адресу "http://localhost:3100/api/order"
