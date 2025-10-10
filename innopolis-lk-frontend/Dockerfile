FROM node:18-alpine as builder

WORKDIR /app

# Копируем package файлы
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci --omit=dev

# Копируем исходный код
COPY . .

# Собираем приложение
RUN npm run build

# Production образ
FROM node:18-alpine

WORKDIR /app

# Устанавливаем serve для статических файлов
RUN npm install -g serve

# Копируем собранное приложение
COPY --from=builder /app/build ./build

# Указываем порт
EXPOSE 3000

# Запускаем сервер
CMD ["serve", "-s", "build", "-l", "3000"]
