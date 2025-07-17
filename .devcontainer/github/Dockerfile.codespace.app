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

RUN rm -f /etc/apt/sources.list.d/mongodb-org-8.0.list \
    && rm -f /etc/apt/sources.list.d/mongodb-org-*.list \
    && echo "--- After removing old repo files ---" \
    && ls -l /etc/apt/sources.list.d/ # Verify removal

RUN curl -fsSL https://pgp.mongodb.com/server-6.0.asc | \
    gpg --dearmor | tee /usr/share/keyrings/mongodb-archive-keyring.gpg > /dev/null

RUN echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-archive-keyring.gpg ] https://repo.mongodb.org/apt/debian bookworm/mongodb-org/6.0 main" | tee /etc/apt/sources.list.d/mongodb-org-6.0.list > /dev/null

RUN echo "--- Before final apt-get update ---" \
    && ls -l /etc/apt/sources.list.d/ \
    && apt-get update && apt-get install -y --no-install-recommends \
    mongodb-database-tools \
    && rm -rf /var/lib/apt/lists/*

ARG PRISMA_SCHEMA
ENV PRISMA_SCHEMA=$PRISMA_SCHEMA

RUN npm install -g nodemon

COPY . .

EXPOSE ${NUXT_PORT}