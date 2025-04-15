1. как запустить frontend:

1.1. Построить image docker
docker build -t frontend-app .

2.2. Запустить контейнер
docker run -d -p 4000:80 --name web-frontend frontend-app
frontend доступен по адресу "http://localhost:4000"

2. как запустить backend:

2.1 backend/auth-service
- docker compose up
доступен по адресу "http://localhost:3000/api/auth"

2.2 backend/food-service
- docker compose up
доступен по адресу "http://localhost:3200/api/food"

2.3 backend/order-service
- docker compose up
доступен по адресу "http://localhost:3100/api/order"
