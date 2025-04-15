Перед началом работы скачать Docker Desktop 
https://www.docker.com/products/docker-desktop/

После установки перезапустить пк. 
Далее открыть PowerShell с правами администратора и выполнить: 
  - wsl --install

#########################################################################
Установить typescript:
  - npm install -g typescript

Установить зависимости для backend и frontend соответственно:
  - cd backend npm install
  - cd frontend npm install

#########################################################################
1. Как запустить backend:

Сначала создаем общую сеть (для взаимодейтсвия сервисов auth, food, order):
docker network create backend-network

Проверка
- docker network ls

1.1 backend/auth-service
- docker compose up
доступен по адресу "http://localhost:3000/api/auth"

1.2 backend/food-service
- docker compose up
доступен по адресу "http://localhost:3200/api/food"

1.3 backend/order-service
- docker compose up
доступен по адресу "http://localhost:3100/api/order"

#########################################################################

2. Как запустить frontend:

a. Построить image docker
docker build -t frontend-app .

b. Запустить контейнер
docker run -d -p 4000:80 --name web-frontend frontend-app

frontend доступен по адресу "http://localhost:4000"


