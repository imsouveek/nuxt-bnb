# Have to call npm install after codespace container is created
npm install

# Generate prisma client
npx prisma generate --schema=server/payment/bootstrap/prisma/schema.prisma