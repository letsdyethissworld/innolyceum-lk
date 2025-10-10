FROM node:18-alpine

WORKDIR /app

# Копируем package.json
COPY package.json ./

# Заменяем npm ci на npm install
RUN npm install --omit=dev

# Копируем исходный код
COPY . .

# Собираем приложение
RUN npm run build

# Устанавливаем serve для статических файлов
RUN npm install -g serve

# Открываем порт
EXPOSE 8080

# Запускаем приложение
CMD ["serve", "-s", "dist", "-l", "8080"]
