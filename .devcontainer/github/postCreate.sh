#!/bin/sh

# Have to call npm install after codespace container is created
npm install

# Generate prisma client
npx prisma generate --schema=server/payment/bootstrap/prisma/schema.prisma

# Restore Mongo DB data
mongorestore -u sobo -p secret --host mongodb --port 27017 --drop db/seed/mongodb/

# Restore Postgres DB data
export PGPASSWORD="secret"
psql -h postgresdb -p 5432 -U sobo -d nuxtbnb -f db/seed/postgres/nuxtbnb_seed.sql
unset PGPASSWORD

# Start dev server
npm run dev