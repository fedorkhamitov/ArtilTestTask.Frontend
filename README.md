# Artil Test Task by Fedor Khamitov 'Library Management'

Монорепозиторий с полной средой:
- **MongoDB** (контейнер `mongodb`)
- **API** на ASP.NET Core (контейнер `api`)
- **Frontend** на React + Vite (контейнер `frontend`)

## Установка и запуск

1. **Клонировать репозиторий**

```bash 
git clone git clone https://github.com/fedorkhamitov/ArtilTestTask.git
```
```bash 
git clone git clone https://github.com/fedorkhamitov/ArtilTestTask.Frontend.git
```
```bash
mv ArtilTestTask.Frontend ArtilTestTask/
```
```bash
cd ArtilTestTask
```

### Структура проекта должна получиться
```
ArtilTestTask/
├── docker-compose.yml
├── init-mongo.js
├── src/
│ └── EntitiesApp.Api/
│ └── Dockerfile
└── ArtilTestTask.Frontend/
└── mybooks/
├── Dockerfile
└── …React…
```

2. **Запустить все сервисы**

```bash
docker-compose up --build -d
```

- **MongoDB** (порт 27017)  
- **API** (порт 5000)  
- **Frontend** (порт 3000)

3. **Проверить статус контейнеров**

```bash
docker-compose ps
```

4. **Доступ к сервисам**

- **Фронтенд**: http://localhost:3000  
- **API**: http://localhost:5000  
- **MongoDB**: mongodb://admin:admin123@localhost:27017/booksdb?authSource=admin

5. **Остановка и удаление**

```bash
docker-compose down
```

## Инициализация БД

При первом запуске контейнер `mongodb` выполнит скрипт `init-mongo.js`, который:
- Создаёт пользователя `admin` с паролем `Admin123!`
- Создаёт базу `booksdb`
- При необходимости добавляет стартовые данные (если в базе меньше 100_000 записей, то добавляются 150_000 записей)

## Особенности

- **SPA** фронтенд обслуживается через Nginx  
- **API** настроен на CORS и слушает `http://+:5000`  
- **Healthcheck** для MongoDB гарантирует готовность перед запуском API  

## Диагностика

- Смотреть логи:
```bash
docker-compose logs mongodb
docker-compose logs api
docker-compose logs frontend
```
