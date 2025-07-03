import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import authRouter from './resources/auth/route.js'
import userRouter from './resources/users/route.js'
import homeRouter from './resources/homes/route.js'
import searchRouter from './resources/search/route.js'
import imageRouter from './resources/images/route.js'
import bookingRouter from './resources/bookings/route.js'
import csrf from './services/csrf.js'
import { sendJSON } from './utils/response.js'

export default function createApiRouter (controllers) {
    const router = express.Router()

    router.use(
        cors({
            origin: (origin, callback) => {
                if (
                    !origin ||
                    origin === controllers.config.url.app ||
                    origin === controllers.config.url.payment ||
                    (origin === controllers.config.url.local && controllers.config.auth.skip_cors)
                ) {
                    return callback(null, true)
                }
                console.log('Incoming Origin:', origin)
                console.log('Expected Origin:', controllers.config.url.app)
                return callback(new Error(`Not allowed by CORS: ${origin}, ${controllers.config.url.app}`))
            },
            credentials: true
        })
    )
    router.use(helmet())

    const { csrfRouter, csrfMiddleware } = csrf(controllers.config.auth)
    router.use('/csrf-token', csrfRouter())

    router.use(controllers.middleware.internalAuth)
    router.use(csrfMiddleware)
    router.use(controllers.middleware.queryparams)

    router.use('/auth', authRouter(controllers))
    router.use('/users', userRouter(controllers))
    router.use('/homes', homeRouter(controllers))
    router.use('/search', searchRouter(controllers))
    router.use('/images', imageRouter(controllers))
    router.use('/bookings', bookingRouter(controllers))

    // Catch errors
    router.use((err, req, res, next) => {
        const message = err?.message || 'Unexpected error'
        const status = err?.status || 500

        sendJSON(res, { error: message }, status)
    })

    return router
}
