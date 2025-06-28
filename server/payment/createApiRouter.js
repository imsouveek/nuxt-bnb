import express from 'express'
import orderRouter from './resources/orders/route.js'
import webhookRouter from './resources/webhooks/route.js'
import { sendJSON } from './utils/response.js'

export default function createApiRouter (controllers) {
    const router = express.Router()

    router.use('/orders', orderRouter(controllers))
    router.use('/webhooks', webhookRouter(controllers))

    // Catch errors
    router.use((err, req, res, next) => {
        const message = err?.message || 'Unexpected error'
        const status = err?.status || 500

        sendJSON(res, { error: message }, status)
    })

    return router
}
