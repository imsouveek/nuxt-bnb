import { startTestDb, clearDatabase, stopTestDb } from './testUtils'
import createApp from './runner'
import { jest } from '@jest/globals'

global.__TEST_STATE__ = {}

beforeAll(async () => {
    global.console = {
        ...console,
        // uncomment to ignore a specific log level
        log: jest.fn(),
        debug: jest.fn(),
        info: jest.fn(),
        // warn: jest.fn(),
        // error: jest.fn(),
    }

    const dbCfg = await startTestDb()
    const { dbClient, app, config } = await createApp(dbCfg)

    global.__TEST_STATE__.app = app
    global.__TEST_STATE__.dbClient = dbClient
    global.__TEST_STATE__.config = config
})

beforeEach(async () => {
    await clearDatabase(global.__TEST_STATE__.dbClient)
})

afterAll(async () => {
    await stopTestDb(global.__TEST_STATE__.dbClient)
    global.__TEST_STATE__ = {}
})