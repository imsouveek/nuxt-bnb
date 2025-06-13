import express from 'express'

export default function (controllers) {
    const router = express.Router()

    router.use(controllers.middleware.auth)
    router.post('/', controllers.order.create)
    router.get('/:id', controllers.order.get)

    return router
}