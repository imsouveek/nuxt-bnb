import express from 'express'

export default function (controllers) {
    const router = express.Router()

    router.post('/:gateway', controllers.webhook.completeOrder)
    router.post('/:gateway/client', controllers.webhook.completeClientOrder)

    return router
}
