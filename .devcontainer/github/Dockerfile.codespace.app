FROM node:current-slim 

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    gnupg \
    git \
    python3 \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/* 

RUN set -x; \
    wget -qO- https://www.mongodb.org/static/pgp/server-8.0.asc | sudo tee /etc/apt/trusted.gpg.d/server-8.0.asc \
    echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/8.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-8.0.list \
    apt-get update; \
    apt-get install -y --no-install-recommends mongodb-mongosh; \
    rm -rf /var/lib/apt/lists/*

ARG PRISMA_SCHEMA
ENV PRISMA_SCHEMA=$PRISMA_SCHEMA

RUN npm install -g nodemon

COPY . .

EXPOSE ${NUXT_PORT}