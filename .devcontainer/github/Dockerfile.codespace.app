FROM node:current-slim 

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    python3 \
    postgresql-client \
    ca-certificates \
    curl \
    gnupg && \
    curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
    gpg -o /etc/apt/keyrings/mongodb-apt-keyring.gpg --dearmor && \
    echo "deb [ arch=amd64,signed-by=/etc/apt/keyrings/mongodb-apt-keyring.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | \
    tee /etc/apt/sources.list.d/mongodb-org-7.0.list && \
    apt-get update && \
    apt-get install -y mongodb-mongosh && \
    rm -rf /var/lib/apt/lists/*

ARG PRISMA_SCHEMA
ENV PRISMA_SCHEMA=$PRISMA_SCHEMA

RUN npm install -g nodemon

COPY . .

EXPOSE ${NUXT_PORT}