import express from 'express'

export default function (controllers) {
    const router = express.Router()

    // Public: View bookings
    router.get('/:id?', controllers.booking.get)

    router.post('/', controllers.middleware.auth, controllers.booking.create)
    router.patch('/:id', controllers.middleware.auth, controllers.booking.update)

    return router
}