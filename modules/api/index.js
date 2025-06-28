import express from 'express'
import { bootstrapServer } from '../../server/api/bootstrap'
import createApiRouter from '../../server/api/createApiRouter'

export default function () {
    this.nuxt.hook('render:setupMiddleware', async (app) => {
        const { controllers } = await bootstrapServer(this.options)

        const router = express.Router()
        router.use(express.json({ limit: '20mb' }))
        router.use(createApiRouter(controllers))

        app.use('/api', router)
    })
}
