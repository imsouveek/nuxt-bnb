# Use base image which contains installed node_modules
FROM nuxt-bnb-base:dev

# Set working directory
WORKDIR /app

# Now copy the rest of the application
COPY . .

# Accept build-time PRISMA_SCHEMA
ARG PRISMA_SCHEMA

ENV PRISMA_SCHEMA=$PRISMA_SCHEMA

# # Migrate Prisma and generate client during build
RUN npx prisma generate --schema=$PRISMA_SCHEMA

# Expose Nuxt port
EXPOSE ${NUXT_PORT}
