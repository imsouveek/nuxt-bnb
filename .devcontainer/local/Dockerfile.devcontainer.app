FROM node:current-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    gnupg \
    git \
    python3 \
    && rm -rf /var/lib/apt/lists/* 

ARG PRISMA_SCHEMA
ENV PRISMA_SCHEMA=$PRISMA_SCHEMA

RUN npm install -g nodemon

COPY package.json ./
COPY .npmrc ./

RUN npm install

COPY . .

RUN npx prisma generate --schema=$PRISMA_SCHEMA

EXPOSE ${NUXT_PORT}
