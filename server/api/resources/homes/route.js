import express from 'express'
import reviewRoutes from '../homes/reviews/route.js'
import availabilityRoutes from './availabilities/route.js'

export default function (controllers) {
    const router = express.Router()

    router.use(controllers.middleware.auth)

    router.post('/', controllers.home.create)
    router.get('/:id?', controllers.home.get)
    router.patch('/:id', controllers.home.patch)
    router.delete('/:id', controllers.home.remove)

    router.use('/:id/reviews', reviewRoutes(controllers))
    router.use('/:id/availabilities', availabilityRoutes(controllers))

    return router
}
