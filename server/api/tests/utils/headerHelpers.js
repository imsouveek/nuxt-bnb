import request from 'supertest'

export async function getCsrfToken(app) {
    const csrfCookieName = global.__TEST_STATE__.config.auth.csrf_cookie
    const csrfHeaderName = global.__TEST_STATE__.config.auth.csrf_header
    const csrfRes = await request(app)
        .post('/api/csrf-token')
        .expect(201)

    const signedValue = extractCookieValue(csrfRes.headers['set-cookie'], csrfCookieName)

    if (!signedValue) {
        throw new Error('Missing CSRF cookie')
    }

    const dotIndex = signedValue.lastIndexOf('.')
    if (dotIndex === -1) {
        throw new Error('Invalid signed CSRF cookie format')
    }

    const encodedPayload = signedValue.slice(0, dotIndex)
    let csrfToken

    try {
        const parsed = JSON.parse(decodeURIComponent(encodedPayload))
        csrfToken = parsed.token
    } catch (err) {
        throw new Error('Failed to parse CSRF cookie payload')
    }

    if (!csrfToken) {
        throw new Error('CSRF token missing from cookie payload')
    }

    return {
        csrfToken,
        csrfHeaderName,
        csrfCookie: `${csrfCookieName}=${signedValue}`,
        csrfHeader: () => ({ [csrfHeaderName]: csrfToken })
    }
}

export async function loginUser(app, email, password) {
    const refreshCookieName = global.__TEST_STATE__.config.auth.refresh_cookie
    const { csrfCookie, csrfHeader } = await getCsrfToken(app)

    const loginRes = await request(app)
        .post('/api/auth/login')
        .set(csrfHeader())
        .set('Cookie', csrfCookie)
        .send({ email, password })

    const accessToken = loginRes.body.access_token
    const refreshCookie = extractCookieValue(loginRes.headers['set-cookie'], refreshCookieName)

    if (!accessToken || !refreshCookie) {
        throw new Error('Login failed or refresh cookie missing')
    }

    return {
        accessToken,
        refreshCookie: `${refreshCookieName}=${refreshCookie}`,
        authHeader: () => ({ Authorization: `Bearer ${accessToken}` }),
    }
}

export function extractCookieValue(setCookieHeader, cookieName) {
    const cookie = (Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader])
        .find(str => str.startsWith(`${cookieName}=`))

    return cookie ? cookie.split(';')[0].split('=')[1] : null
}
