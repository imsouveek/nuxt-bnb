import { GenericContainer } from 'testcontainers'

let mongoContainer
let mailpitContainer

export const startTestDb = async () => {
    mongoContainer = await new GenericContainer('mongo')
        .withExposedPorts(27017)
        .start()

    const host = mongoContainer.getHost()
    const port = mongoContainer.getMappedPort(27017)
    const mongoUri = `mongodb://${host}:${port}/`

    return mongoUri
}

export const stopTestDb = async (dbClient) => {
    await dbClient.destroy()
    if (mongoContainer) {
        await mongoContainer.stop()
        mongoContainer = null
    }
}

export const clearDatabase = async (dbClient) => {
    if (!dbClient || dbClient.readyState !== 1) {
        return
    }

    const collections = dbClient.collections
    for (const key in collections) {
        await collections[key].deleteMany({})
    }
}

export const startMailpit = async () => {
    mailpitContainer = await new GenericContainer('axllent/mailpit')
        .withExposedPorts(1025)
        .withExposedPorts(8025)
        .start()

    const smtpHost = mailpitContainer.getHost()
    const smtpPort = mailpitContainer.getMappedPort(1025)
    const smtpApiPort = mailpitContainer.getMappedPort(8025)
    return { smtpHost, smtpPort, smtpApiPort }
}

export const stopMailpit = async () => {
    if (mailpitContainer) {
        await mailpitContainer.stop()
        mailpitContainer = null
    }
}
