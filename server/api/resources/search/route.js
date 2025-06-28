import express from 'express'

export default function (controllers) {
    const router = express.Router()

    router.get('/homes', controllers.search.getHomes)
    router.get('/homes/:id', controllers.search.getHomeById)

    // Keep this generic fallback for other paths like /owner or /availabilities
    router.get('/homes/:id/:path', controllers.search.getHomePath)

    return router
}
