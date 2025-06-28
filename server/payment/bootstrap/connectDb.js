import { PrismaClient } from './prisma/generated/prisma-client'

const clientMap = new Map()
export const __test__clientMap = clientMap

export default async ({ dbUrl, dbName }) => {
    if (!dbUrl || !dbName) {
        throw new Error('dbUrl and dbName are required')
    }

    const cacheKey = `${dbUrl}${dbName}`

    // Return cached connection
    if (clientMap.has(cacheKey)) {
        return clientMap.get(cacheKey)
    }

    // Create new client
    const prisma = new PrismaClient({
        datasources: {
            db: { url: `${dbUrl}${dbName}` }
        }
    })

    try {
        await prisma.$connect()
        clientMap.set(cacheKey, prisma)
        console.log(`Connected to Postgres: ${cacheKey}`)
        return prisma
    } catch (err) {
        console.error(`Failed to connect to Postgres: ${cacheKey}`, err)
        clientMap.delete(cacheKey)
        throw err
    }
}
