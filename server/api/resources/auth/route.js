import express from 'express'

export default function (controllers) {
    const router = express.Router()

    router.post('/login', controllers.auth.login)
    router.post('/google-auth', controllers.auth.googleLogin)
    router.post('/forgot', controllers.auth.forgotPassword)
    router.post('/reset', controllers.auth.resetPassword)
    router.post('/refresh', controllers.auth.refreshAccessToken)

    return router
}