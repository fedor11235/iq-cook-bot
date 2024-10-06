#### Запуск Mongo локально
Клонировать репозиторий
```
git clone git@github.com:intro333/iq-cook-bot.git
```
Создать .env и заполнить данными (напр. BOT_TOKEN)
```
cp .env.example .env
```
Запустить билд сборки
```
docker compose -f ./docker/compose/mongodb/docker-compose.yml --project-directory . up --detach
```
После успешного запуска контейнера, зайти в контейнер монги
```
docker exec -ti mongodbiqcookcore sh
```
Зайти в монгу под логином/паролем
```
mongosh -u iqcookuser -p 1234 --authenticationDatabase admin
```
Зайти (оно же создать) в БД
```
use iqcookcore
```
И именно из этой БД добавить юзера с паролем к БД
```
db.createUser({
  user: 'iqcookuser',
  pwd: '1234',
  roles: [
    {
      role: 'dbOwner',
      db: 'iqcookcore',
    },
  ],
})
```
Запуск бота
```
pm2 start dist/index.js
```
Ресурс
https://www.npmjs.com/package/pm2