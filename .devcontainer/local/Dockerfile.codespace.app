# Use lightweight Alpine-based Node image with musl libc
FROM node:current-alpine

WORKDIR /app

ARG PRISMA_SCHEMA
ENV PRISMA_SCHEMA=$PRISMA_SCHEMA

RUN npm install -g nodemon

COPY package.json ./
COPY .npmrc ./

RUN npm install

COPY . .

RUN npx prisma generate --schema=$PRISMA_SCHEMA

EXPOSE ${NUXT_PORT}
