FROM node:current-alpine

RUN apk add --no-cache git
RUN apk add --no-cache python3

WORKDIR /app

ARG PRISMA_SCHEMA
ENV PRISMA_SCHEMA=$PRISMA_SCHEMA

RUN npm install -g nodemon

COPY package.json ./
COPY .npmrc ./

COPY . .

EXPOSE ${NUXT_PORT}