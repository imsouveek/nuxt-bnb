FROM node:20-bookworm

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

EXPOSE ${NUXT_PORT}
