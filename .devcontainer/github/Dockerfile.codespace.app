# Use lightweight Alpine-based Node image with musl libc
FROM node:current-alpine

RUN apk add bash

WORKDIR /app

ARG NODE_PLATFORM=linuxmusl
ARG NODE_LIBC=musl
ARG PRISMA_SCHEMA

ENV npm_config_platform=$NODE_PLATFORM
ENV npm_config_libc=$NODE_LIBC
ENV npm_config_legacy_peer_deps=true
ENV PRISMA_SCHEMA=$PRISMA_SCHEMA

RUN npm install -g nodemon

COPY package.json ./

COPY . .

RUN npx prisma generate --schema=$PRISMA_SCHEMA

EXPOSE ${NUXT_PORT}
