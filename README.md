Перед началом работы скачать Docker Desktop 
https://www.docker.com/products/docker-desktop/

После установки перезапустить пк. 
Далее открыть PowerShell с правами администратора и выполнить: 
wsl --install

#########################################################################
1. Как запустить backend:

a. backend/auth-service
- docker compose up
доступен по адресу "http://localhost:3000/api/auth"

b. backend/food-service
- docker compose up
доступен по адресу "http://localhost:3200/api/food"

c. backend/order-service
- docker compose up
доступен по адресу "http://localhost:3100/api/order"

#########################################################################

2. Как запустить frontend:

a. Построить image docker
docker build -t frontend-app .

b. Запустить контейнер
docker run -d -p 4000:80 --name web-frontend frontend-app

frontend доступен по адресу "http://localhost:4000"

2. Как запустить backend:

Сначала создаем общую сеть (для взаимодейтсвия сервисов auth, food, order):
docker network create backend-network

Проверка
docker network ls

2.1 backend/auth-service
- docker compose up
доступен по адресу "http://localhost:3000/api/auth"

2.2 backend/food-service
- docker compose up
доступен по адресу "http://localhost:3200/api/food"

2.3 backend/order-service
- docker compose up
доступен по адресу "http://localhost:3100/api/order"
