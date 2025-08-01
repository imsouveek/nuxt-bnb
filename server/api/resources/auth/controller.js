import cookie from 'cookie'
import jwt from 'jsonwebtoken'
import ms from 'ms'
import { OAuth2Client } from 'google-auth-library'
import { sendJSON } from '../../utils/response.js'

export default (services, config) => {
    const refreshCookieName = config.auth.refresh_cookie
    const refreshSecret = config.auth.refresh_secret
    const refreshLife = config.auth.refresh_life
    const googleClientId = config.auth.clientId
    const passwordTokenExpiry = config.auth.password_token_expiry

    async function login (req, res) {
        try {
            const user = await services.user.validateUser(req.body.email, req.body.password, 'local')
            await sendLoginResponse(user, res)
        } catch {
            sendJSON(res, { error: 'Authentication Failed' }, 401)
        }
    }

    async function googleLogin (req, res) {
        try {
            const client = new OAuth2Client()
            const ticket = await client.verifyIdToken({
                idToken: req.body.token,
                audience: googleClientId
            })

            const googleUser = ticket.getPayload()
            let user

            try {
                user = await services.user.validateUser(googleUser.email, 'ignore', 'google')
            } catch {
                const image = await services.image.setImage(googleUser.picture.split('=')[0])
                user = await services.user.create({
                    name: googleUser.name,
                    email: googleUser.email,
                    password: req.body.token,
                    image: image._id
                }, 'google')
            }

            await sendLoginResponse(user, res)
        } catch {
            sendJSON(res, { error: 'Authentication Failed' }, 401)
        }
    }

    async function sendLoginResponse (user, res, token = null) {
        const tokens = await services.user.getNewToken(user, token)
        const expires = new Date(Date.now() + ms(refreshLife))

        const refresh_cookie = cookie.serialize(refreshCookieName, tokens.refresh_token, {
            path: '/',
            secure: true,
            httpOnly: true,
            sameSite: 'none',
            expires
        })

        res.setHeader('Set-Cookie', refresh_cookie)
        sendJSON(res, {
            user,
            access_token: tokens.access_token
        })
    }

    async function forgotPassword (req, res) {
        try {
            const token = await services.token.getNewToken(req.body.email, 'password', passwordTokenExpiry)
            await services.email.sendForgottenPasswordEmail(token)
            sendJSON(res, { message: 'Please check your email' })
        } catch (e) {
            sendJSON(res, { error: e.message }, 500)
        }
    }

    async function resetPassword (req, res) {
        try {
            const user = await services.token.validateToken(req.body.token, 'password')
            if (user.authStrategy !== 'local') {
                return sendJSON(res, { message: 'Invalid email for password reset' }, 500)
            }
            await services.user.patch(user, { password: req.body.password })
            sendJSON(res, { message: 'Successfully reset password' })
        } catch (e) {
            sendJSON(res, { error: e.message }, 401)
        }
    }

    async function refreshAccessToken (req, res) {
        try {
            const cookies = cookie.parse(req.headers.cookie)
            const token = cookies[refreshCookieName]
            if (!token) {
                throw new Error('Please Authenticate')
            }

            const decoded = jwt.verify(token, refreshSecret)
            const user = await services.user.validateToken(decoded._id, token)

            await sendLoginResponse(user, res, token)
        } catch (err) {
            sendJSON(res, { error: err.message }, 401)
        }
    }

    return {
        login,
        googleLogin,
        forgotPassword,
        resetPassword,
        refreshAccessToken
    }
}
