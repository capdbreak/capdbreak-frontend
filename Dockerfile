# Vite 빌드 단계
FROM node:20 AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install --include=dev
COPY . .
RUN chmod +x node_modules/.bin/vite
RUN npm run build

# Nginx에서 정적 파일 서빙
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
# Ensure favicon is copied (if it's in the public directory)
COPY --from=builder /app/public/favicon.ico /usr/share/nginx/html/favicon.ico
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
