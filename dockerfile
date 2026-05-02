# ビルド環境
FROM node:24-alpine AS build-stage
WORKDIR /app
RUN corepack enable
COPY package.json ./
RUN pnpm install
COPY . .
RUN pnpm run build

# 本番環境
FROM nginx:stable-alpine AS production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
