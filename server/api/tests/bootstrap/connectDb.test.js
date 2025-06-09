import mongoose from 'mongoose'
import connectDb, { __test__clientMap } from '../../bootstrap/connectDb.js'
import { getOrCreateModel } from '../../utils/getModel.js'
import { jest } from '@jest/globals'

let dbUrl, dbName

describe('connectDb (MongoDB)', () => {
    beforeEach(() => {
        dbUrl = global.__TEST_STATE__.config.apiDb.dbUrl
        dbName = global.__TEST_STATE__.config.apiDb.dbName
    })

    afterEach(async () => {
        for (const client of __test__clientMap.values()) {
            await client.close()
        }
        __test__clientMap.clear()
    })

    it('throws an error if dbUrl or dbName is missing', async () => {
        await expect(connectDb({})).rejects.toThrow('dbUrl and dbName are required')
    })

    it('returns a real Mongoose connection if not cached', async () => {
        __test__clientMap.clear()
        const client = await connectDb({ dbUrl, dbName })
        expect(client).toBeDefined()
        expect(client.name).toBe(dbName)
    })

    it('returns cached connection on second call', async () => {
        __test__clientMap.clear()
        const conn1 = await connectDb({ dbUrl, dbName })
        const conn2 = await connectDb({ dbUrl, dbName })
        expect(conn2).toBe(conn1)
    })

    // Use mocked connection to avoid test timeout issues
    it('cleans up and throws if connection fails', async () => {
        const fakeConn = {
            asPromise: jest.fn().mockRejectedValueOnce(new Error('fail')),
            destroy: jest.fn()
        }

        // Remove existing mock and apply ours
        jest.spyOn(mongoose, 'createConnection').mockReturnValueOnce(fakeConn)

        const originalError = console.error
        console.error = jest.fn() // suppress expected error log

        await expect(connectDb({
            dbUrl: 'mongodb://invalid',
            dbName: 'fail-db'
        })).rejects.toThrow('fail')

        expect(fakeConn.destroy).toHaveBeenCalled()

        console.error = originalError // restore console.error
    })
})

describe('getOrCreateModel', () => {
    let conn

    beforeEach(() => {
        conn = mongoose.createConnection()
    })

    afterEach(async () => {
        if (conn.readyState === 1) await conn.close()
    })

    it('creates a model if it does not exist', () => {
        const schema = new mongoose.Schema({ name: String })
        const model = getOrCreateModel(conn, 'TestUser', schema)
        expect(model.modelName).toBe('TestUser')
    })

    it('returns existing model if schema matches', () => {
        const schema = new mongoose.Schema({ name: String })
        const model1 = getOrCreateModel(conn, 'TestUser', schema)
        const model2 = getOrCreateModel(conn, 'TestUser', schema)
        expect(model2).toBe(model1)
    })

    it('throws if existing model has a different schema', () => {
        const schema1 = new mongoose.Schema({ name: String })
        const schema2 = new mongoose.Schema({ email: String })
        getOrCreateModel(conn, 'TestUser', schema1)
        expect(() => {
            getOrCreateModel(conn, 'TestUser', schema2)
        }).toThrow(/different schema/i)
    })
})