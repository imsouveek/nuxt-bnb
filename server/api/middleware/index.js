import authMiddleware from './auth.js';
import queryParamsMiddleware from './queryparams.js';

export default (services, auth) => {
    return {
        auth: authMiddleware(services, auth),
        queryparams: queryParamsMiddleware
    }
}