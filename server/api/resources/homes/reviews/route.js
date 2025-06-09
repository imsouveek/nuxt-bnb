import express from 'express'

export default function (controllers) {
    const router = express.Router({ mergeParams: true })

    router.get('/', controllers.review.get) // No auth required

    return router
}