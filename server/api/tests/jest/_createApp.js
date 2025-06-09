import express from 'express'
import { bootstrapServer } from '../../bootstrap'
import createApiRouter from '../../createApiRouter'

export default async function createApp({ mongoUri, smtpHost = 'localhost', smtpPort = 1025 }) {
    const options = {
        publicRuntimeConfig: {
            auth: {
                clientId: 'test-google-client-id'
            },
            url: {
                app: 'http://localhost:3000',
            }
        },
        privateRuntimeConfig: {
            apiDb: {
                dbUrl: mongoUri,
                dbName: 'test-db',
            },
            auth: {
                access_secret: 'test-access-secret',
                access_life: '15m',
                refresh_secret: 'test-refresh-secret',
                refresh_cookie: 'test-refresh-cookie',
                refresh_life: '7d',
            },
            smtp: {
                host: smtpHost,
                port: smtpPort
            }
        }
    }

    const { dbClient, controllers, config } = await bootstrapServer(options)

    const app = express()
    app.use(express.json({ limit: '20mb' }))
    app.use('/api', createApiRouter(controllers))

    return {
        dbClient,
        app,
        config
    }
}
