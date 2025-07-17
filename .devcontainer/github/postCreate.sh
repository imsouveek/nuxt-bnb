echo "Starting postCreate script"

# Generate prisma client
npx prisma generate --schema=server/payment/bootstrap/prisma/schema.prisma
