import express from 'express'

export default function (controllers) {
    const router = express.Router({ mergeParams: true })

    router.post('/', controllers.availability.create)
    router.get('/', controllers.availability.get)
    router.delete('/', controllers.availability.remove)

    return router
}
