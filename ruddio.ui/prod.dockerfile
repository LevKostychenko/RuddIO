FROM node:alpine AS builder

WORKDIR /app

COPY package.json .
COPY package-lock.json .
RUN npm ci

RUN npm install -g serve

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["serve", "-s", "dist"]