import cookie from 'cookie'
import { sendJSON } from '../../utils/response.js'

export default (services, auth) => {
    async function create(req, res, next) {
        try {
            const user = await services.user.create({ ...req.body }, 'local')
            sendJSON(res, user, 201)
        } catch (e) {
            if (e.code === 11000) {
                return sendJSON(res, { error: 'Duplicate email' }, 400)
            }
            next(e)
        }
    }

    async function get(req, res, next) {
        try {
            const user = await services.user.get(req.user._id, req.queryparams?.fieldList)
            sendJSON(res, user)
        } catch (e) {
            next(e)
        }
    }

    async function patch(req, res, next) {
        try {
            const updatedUser = await services.user.patch(req.user, req.body)
            sendJSON(res, updatedUser)
        } catch (e) {
            next(e)
        }
    }

    async function remove(req, res, next) {
        try {
            const deletedUser = await services.user.remove(req.user)
            sendJSON(res, deletedUser)
        } catch (e) {
            next(e)
        }
    }

    async function logout(req, res, next) {
        try {
            await services.user.removeToken(req.user, req.token)
            logOutCookie(res)
        } catch (e) {
            next(e)
        }
    }

    async function logoutAll(req, res, next) {
        try {
            await services.user.removeAllTokens(req.user)
            logOutCookie(res)
        } catch (e) {
            next(e)
        }
    }

    function logOutCookie(res) {
        const expires = new Date()
        expires.setDate(expires.getDate() - 1)

        const refresh_cookie = cookie.serialize(
            auth.refresh_cookie,
            '',
            {
                path: '/',
                secure: true,
                httpOnly: true,
                sameSite: true,
                expires,
            }
        )

        res.setHeader('Set-Cookie', refresh_cookie)
        sendJSON(res, { status: 'Logged out successfully' })
    }

    async function getToken(req, res, next) {
        try {
            if (!req.body.type) {
                throw new Error('Token type is required')
            }

            const { image_token_expiry } = auth
            let token_life

            switch (req.body.type) {
                case 'image':
                    token_life = image_token_expiry
                    break;
                default:
                    throw new Error('Unsupported token type')
            }

            const token = await services.token.getNewToken(req.user.email, req.body.type, token_life)
            sendJSON(res, { token })
        } catch (e) {
            next(e)
        }
    }

    return {
        create,
        get,
        patch,
        remove,
        logout,
        logoutAll,
        getToken
    }
}
