import { jest } from '@jest/globals'
import dbConnection, { __test__clientMap } from '../../bootstrap/connectDb.js'

let dbUrl, dbName

describe('connectDb (Postgres)', () => {
    beforeEach(() => {
        dbUrl = global.__TEST_STATE__.config.paymentDb.dbUrl
        dbName = global.__TEST_STATE__.config.paymentDb.dbName
    })

    it('throws an error if dbUrl or dbName is missing', async () => {
        await expect(dbConnection({})).rejects.toThrow('dbUrl and dbName are required')
    })

    it('returns a new Prisma client if not cached', async () => {
        __test__clientMap.clear()
        const client = await dbConnection({ dbUrl, dbName })
        expect(client).toBeDefined()
        const result = await client.$queryRaw`SELECT 1`
        expect(result).toBeDefined()
    })

    it('returns cached Prisma client on second call', async () => {
        __test__clientMap.clear()
        const client1 = await dbConnection({ dbUrl, dbName })
        const client2 = await dbConnection({ dbUrl, dbName })
        expect(client2).toBe(client1)
    })

    // Use mocked connection to avoid test timeout issues
    it('throws if connection fails (mocked PrismaClient)', async () => {
        jest.unstable_mockModule('../../bootstrap/prisma/generated/prisma-client', () => {
            return {
                __esModule: true,
                PrismaClient: jest.fn(() => ({
                    $connect: jest.fn().mockRejectedValueOnce(new Error('fail')),
                    $disconnect: jest.fn()
                }))
            }
        })

        const { default: mockedConnectDb } = await import('../../bootstrap/connectDb.js')

        const originalError = console.error
        console.error = jest.fn() // suppress expected error log

        await expect(mockedConnectDb({
            dbUrl: 'postgresql://invalid/',
            dbName: 'fail-db'
        })).rejects.toThrow()

        console.error = originalError // restore console.error
    })
})
