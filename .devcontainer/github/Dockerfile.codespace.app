FROM node:current-alpine

WORKDIR /app

ARG PRISMA_SCHEMA

ENV npm_config_legacy_peer_deps=true

RUN npm install -g nodemon

COPY package.json ./

COPY . .


EXPOSE ${NUXT_PORT}