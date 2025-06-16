import express from 'express'

export default function (controllers) {
    const router = express.Router()

    router.get('/', controllers.middleware.auth, controllers.user.get)
    router.post('/logout', controllers.middleware.auth, controllers.user.logout)
    router.post('/logoutAll', controllers.middleware.auth, controllers.user.logoutAll)

    router.post('/', controllers.user.create)
    router.post('/token', controllers.middleware.auth, controllers.user.getToken)

    router.patch('/', controllers.middleware.auth, controllers.user.patch)
    router.delete('/', controllers.middleware.auth, controllers.user.remove)

    return router
}