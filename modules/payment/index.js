import express from 'express'
import { bootstrapServer } from '../../server/payment/bootstrap'
import createApiRouter from '../../server/payment/createApiRouter'

export default function () {
    this.nuxt.hook('render:setupMiddleware', async (app) => {
        const { controllers } = await bootstrapServer(this.options)

        const router = express.Router()
        router.use(express.json({
            limit: '20mb',
            verify: (req, res, buf) => {
                req.rawBody = buf.toString()
            }
        }))
        router.use(createApiRouter(controllers))

        app.use('/payment', router)
    })
}
