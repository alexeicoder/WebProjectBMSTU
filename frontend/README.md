как запустить:

1. Построить image docker
docker build -t frontend-app .

2. Запустить контейнер
docker run -d -p 4000:80 --name web-frontend frontend-app

frontend доступен по адресу "localhost:4000"