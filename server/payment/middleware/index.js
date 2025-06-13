import authMiddleware from './auth.js'

export default (auth) => {
    return {
        auth: authMiddleware(auth)
    }
}