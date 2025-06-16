import express from 'express'
import crypto from 'crypto'
import ms from 'ms'
import cookie from 'cookie'
import { sendJSON } from '../utils/response.js'

export function signCSRF(value, secret) {
    const hmac = crypto.createHmac('sha256', secret)
    hmac.update(value)
    return `${value}.${hmac.digest('hex')}`
}

function verifyCSRF(signedValue, secret) {
    const i = signedValue.lastIndexOf('.')
    if (i === -1) return null

    const value = signedValue.slice(0, i)
    const sig = signedValue.slice(i + 1)

    const hmac = crypto.createHmac('sha256', secret)
    hmac.update(value)
    const expectedSig = hmac.digest('hex')

    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) {
        return null
    }

    return value
}

export default ({ csrf_secret, csrf_cookie, csrf_header, csrf_life }) => {

    const csrfRouter = () => {
        const router = express.Router()

        router.post('/', (req, res) => {
            const token = crypto.randomBytes(32).toString('hex')
            const expiry = Date.now() + ms(csrf_life)
            const payload = JSON.stringify({ token, expiry })
            const signed = signCSRF(payload, csrf_secret)

            const cookieStr = cookie.serialize(csrf_cookie, signed, {
                path: '/',
                secure: true,
                httpOnly: false,
                sameSite: 'Strict',
                expires: new Date(expiry)
            })

            res.setHeader('Set-Cookie', cookieStr)
            sendJSON(res, {
                message: "Generated Token Successfully"
            }, 201)
        })

        return router
    }

    const csrfMiddleware = (req, res, next) => {
        if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next()

        const cookies = cookie.parse(req.headers.cookie || '')
        const raw = cookies[csrf_cookie]
        const tokenHeader = req.headers[csrf_header]

        if (!raw || !tokenHeader) {
            return sendJSON(res, {
                error: 'Missing CSRF token'
            }, 403)
        }

        const verified = verifyCSRF(raw, csrf_secret)
        if (!verified) {
            return sendJSON(res, {
                error: 'Invalid or tampered CSRF token'
            }, 403)
        }

        try {
            const { token, expiry } = JSON.parse(verified)
            if (Date.now() > expiry) {
                return sendJSON(res, {
                    error: 'Expired CSRF token'
                }, 403)
            }
            if (token !== tokenHeader) {
                return sendJSON(res, {
                    error: 'CSRF token mismatch'
                }, 403)
            }
            next()
        } catch {
            return sendJSON(res, {
                error: 'Corrupted CSRF token'
            }, 403)
        }
    }

    return {
        csrfRouter,
        csrfMiddleware
    }
}
