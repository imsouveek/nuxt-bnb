FROM node:current-alpine

ENV MONGOSH_VERSION="2.5.3" 
RUN curl -LO "https://downloads.mongodb.com/compass/mongosh-${MONGOSH_VERSION}-linux-x64.tgz" \
    && tar -xzf mongosh-${MONGOSH_VERSION}-linux-x64.tgz \
    && sudo mv mongosh-${MONGOSH_VERSION}-linux-x64/bin/mongosh /usr/local/bin/mongosh \
    && rm -rf mongosh-${MONGOSH_VERSION}-linux-x64.tgz mongosh-${MONGOSH_VERSION}-linux-x64 \
    && apk del curl

WORKDIR /app

ARG PRISMA_SCHEMA
ENV PRISMA_SCHEMA=$PRISMA_SCHEMA

RUN npm install -g nodemon

COPY package.json ./
COPY .npmrc ./

COPY . .

EXPOSE ${NUXT_PORT}