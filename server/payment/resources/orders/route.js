import express from 'express'

export default function (controllers) {
    const router = express.Router()

    router.post('/', controllers.order.create)
    router.get('/', controllers.order.list)
    router.get('/:id', controllers.order.get)

    return router
}