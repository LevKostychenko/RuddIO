FROM node:alpine AS builder

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
RUN npm ci

RUN apk add --update xdg-utils

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]