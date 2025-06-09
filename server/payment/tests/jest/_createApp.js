import express from 'express'
import { bootstrapServer } from '../../bootstrap'
import createApiRouter from '../../createApiRouter'

export default async function createApp(paymentDb) {
    const options = {
        privateRuntimeConfig: {
            paymentDb,
            razorpay: {
                key_id: 'razorpay_key',
                key_secret: 'razorpay_secret'
            }

        }
    }

    const { dbClient, controllers, config } = await bootstrapServer(options)
    const app = express()
    app.use(express.json({ limit: '20mb' }))
    app.use('/payment', createApiRouter(controllers))

    return {
        dbClient,
        app,
        config
    }
}