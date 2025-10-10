# Используем официальный Node.js образ
FROM node:18-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости (ВКЛЮЧАЯ devDependencies)
RUN npm ci

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
