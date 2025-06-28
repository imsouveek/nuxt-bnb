import authMiddleware from './auth.js'
import internalAuthMiddleware from './internalAuth.js'
import queryParamsMiddleware from './queryparams.js'

export default (services, config) => {
    return {
        auth: authMiddleware(services, config.auth),
        internalAuth: internalAuthMiddleware(config.paymentAuth),
        queryparams: queryParamsMiddleware(config.url.api)
    }
}
