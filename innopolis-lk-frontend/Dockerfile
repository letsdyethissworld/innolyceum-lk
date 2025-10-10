FROM node:18-alpine
WORKDIR /app
# Копируем оба файла, управляющие зависимостями
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY . .
RUN npm run build

# Устанавливаем serve для статических файлов
RUN npm install -g serve

# Открываем порт
EXPOSE 8080

# Запускаем приложение
CMD ["serve", "-s", "dist", "-l", "8080"]
