import path from 'path'
import { fileURLToPath } from 'url'

import { execSync } from 'child_process'
import { GenericContainer } from 'testcontainers'

let pgContainer

export const startTestDb = async (inPort = 5432) => {
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)

    const dbName = 'nuxtbnb'
    pgContainer = await new GenericContainer('postgres')
        .withExposedPorts(inPort)
        .withEnvironment({
            POSTGRES_USER: "test",
            POSTGRES_PASSWORD: "secret",
            POSTGRES_DB: dbName
        })
        .start()

    const host = pgContainer.getHost()
    const port = pgContainer.getMappedPort(inPort)
    const dbUrl = `postgresql://test:secret@${host}:${port}/`

    const schemaPath = path.resolve(
        __dirname,
        '../../bootstrap/prisma/schema.prisma'
    )

    execSync(`npx prisma db push --schema=${schemaPath}`, {
        env: {
            ...process.env,
            DATABASE_URL: `${dbUrl}${dbName}`,
        },
        stdio: 'inherit',
    })

    return { dbUrl, dbName }
}

export const stopTestDb = async () => {
    if (pgContainer) {
        await pgContainer.stop()
        pgContainer = null
    }
}

export const clearDatabase = async (dbClient) => {
    await dbClient.$executeRawUnsafe(`
        TRUNCATE TABLE "Razorpay", "Gateway", "Order" RESTART IDENTITY CASCADE
      `)
    console.log('Database truncated')
}