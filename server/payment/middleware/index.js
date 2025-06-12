import queryParamsMiddleware from './queryparams.js';
import authMiddleware from './auth.js'

export default (auth) => {
    return {
        auth: authMiddleware(auth),
        queryparams: queryParamsMiddleware
    }
}