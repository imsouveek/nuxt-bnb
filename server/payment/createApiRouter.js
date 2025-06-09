import express from 'express'
import orderRouter from './resources/orders/route.js'
import { sendJSON } from './utils/response.js'

export default function createApiRouter(controllers) {
    const router = express.Router()

    router.use(controllers.middleware.queryparams)
    router.use('/orders', orderRouter(controllers))

    // Catch errors
    // eslint-disable-next-line no-unused-vars
    router.use((err, req, res, next) => {
        const message = err?.message || 'Unexpected error'
        const status = err?.status || 500

        sendJSON(res, { error: message }, status)
    })

    return router
} 