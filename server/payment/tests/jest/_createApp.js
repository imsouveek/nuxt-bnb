import express from 'express'
import { bootstrapServer } from '../../bootstrap'
import createApiRouter from '../../createApiRouter'

export default async function createApp (paymentDb) {
    const options = {
        publicRuntimeConfig: {
            razorpay: {
                key_id: 'razorpay_key'
            },
            url: {
                api: 'https://localhost:3000'
            }
        },
        privateRuntimeConfig: {
            paymentDb,
            razorpay: {
                key_secret: 'razorpay_secret',
                webhook_secret: 'webhook_secret'
            },
            paymentAuth: {
                auth_header: 'payment_auth_header',
                auth_key: 'payment_auth_key'
            }
        }
    }

    const { dbClient, controllers, config } = await bootstrapServer(options)
    const app = express()
    app.use(express.json({
        limit: '20mb',
        verify: (req, res, buf) => {
            req.rawBody = buf.toString()
        }
    }))
    app.use('/payment', createApiRouter(controllers))

    return {
        dbClient,
        app,
        config
    }
}
