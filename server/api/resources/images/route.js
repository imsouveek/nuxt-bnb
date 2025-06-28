import express from 'express'

export default function (controllers) {
    const router = express.Router()

    router.get('/:id', controllers.image.get)
    router.post('/', controllers.middleware.auth, controllers.image.create)
    router.delete('/:id', controllers.middleware.auth, controllers.image.remove)

    return router
}
