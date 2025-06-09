import cookie from 'cookie'
import jwt from 'jsonwebtoken'
import { sendJSON } from '../utils/response.js'

export default function (services, auth) {
    const accessSecret = auth.access_secret
    const refreshCookieName = auth.refresh_cookie

    return async function (req, res, next) {
        try {
            const access_token = req.headers.authorization?.replace('Bearer ', '')
            if (!access_token) throw new Error()

            const cookies = cookie.parse(req.headers.cookie || '')
            const refresh_token = cookies[refreshCookieName]

            const decoded = jwt.verify(access_token, accessSecret)
            const user = await services.user.get(decoded._id)

            req.token = refresh_token
            req.user = user
            next()
        } catch {
            sendJSON(res, { error: 'Please Authenticate' }, 401)
        }
    }
}