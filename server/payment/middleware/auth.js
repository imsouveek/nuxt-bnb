import { sendJSON } from '../utils/response.js'

export default function (auth) {
    const authHeader = auth.auth_header.toLowerCase()
    const authKey = auth.auth_key

    return function (req, res, next) {
        const incoming = req.headers[authHeader]
        if (!incoming || incoming !== authKey) {
            return sendJSON(res, { error: 'Forbidden' }, 401)
        }
        next()
    }
}