# Укажите базовый образ
FROM node:18

# Установите рабочую директорию
WORKDIR /src
# Скопируйте package.json и package-lock.json
COPY package*.json ./

# Установите зависимости
RUN yarn

# Скопируйте остальные файлы проекта
COPY . .

# Соберите проект
RUN yarn build

# Откройте порт (например, 3000)
EXPOSE 443

# Запустите приложение
CMD ["yarn", "start:prod"]