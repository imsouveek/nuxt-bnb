import authMiddleware from './auth.js';
import internalAuthMiddleware from './internalAuth.js';
import queryParamsMiddleware from './queryparams.js';

export default (services, auth, paymentAuth) => {
    return {
        auth: authMiddleware(services, auth),
        internalAuth: internalAuthMiddleware(paymentAuth),
        queryparams: queryParamsMiddleware
    }
}