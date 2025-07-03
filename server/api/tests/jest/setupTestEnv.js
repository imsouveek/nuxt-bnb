import { jest } from '@jest/globals'
import { startTestDb, clearDatabase, stopTestDb, startMailpit, stopMailpit } from './testUtils'
import createApp from './runner.js'

global.__TEST_STATE__ = {}

beforeAll(async () => {
    global.console = {
        ...console,
        // uncomment to ignore a specific log level
        log: jest.fn(),
        debug: jest.fn(),
        info: jest.fn()
        // warn: jest.fn(),
        // error: jest.fn(),
    }

    global.__MOCK_CONFIG__ = {}
    const mongoUri = await startTestDb()
    const { smtpHost, smtpPort, smtpApiPort } = await startMailpit()

    const { dbClient, app, config } = await createApp({ mongoUri, smtpHost, smtpPort })

    global.__TEST_STATE__.app = app
    global.__TEST_STATE__.dbClient = dbClient
    global.__TEST_STATE__.config = config
    global.__TEST_STATE__.smtpUrl = `http://${smtpHost}:${smtpApiPort}`
})

beforeEach(async () => {
    await clearDatabase(global.__TEST_STATE__.dbClient)
})

afterAll(async () => {
    await stopTestDb(global.__TEST_STATE__.dbClient)
    await stopMailpit()
    global.__TEST_STATE__ = {}
})
