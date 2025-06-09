import mongoose from 'mongoose'

const clientMap = new Map()
export const __test__clientMap = clientMap;

export default async function ({ dbUrl, dbName }) {
    if (!dbUrl || !dbName) {
        throw new Error('dbUrl and dbName are required')
    }

    const cacheKey = `${dbUrl}${dbName}`

    // Return existing connection if it exists
    if (clientMap.has(cacheKey)) {
        return clientMap.get(cacheKey)
    }

    const conn = mongoose.createConnection(dbUrl, { dbName })

    try {
        await conn.asPromise()
        clientMap.set(cacheKey, conn)
        console.log(`Connected to MongoDB: ${cacheKey}`)
        return conn
    } catch (err) {
        console.error(`Failed to connect to MongoDB: ${cacheKey}`, err)
        if (typeof conn.destroy === 'function') {
            await conn.destroy()
        }
        clientMap.delete(cacheKey)
        throw err
    }
}