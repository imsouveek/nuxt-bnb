import queryParamsMiddleware from './queryparams.js';

export default () => {
    return {
        queryparams: queryParamsMiddleware
    }
}