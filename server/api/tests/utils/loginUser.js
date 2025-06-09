import request from 'supertest'

export async function loginUser(app, email, password) {
    const login = await request(app)
        .post('/api/auth/login')
        .send({ email, password })

    const accessToken = login.body.access_token
    const refreshCookie = login.headers['set-cookie']

    return {
        accessToken,
        refreshCookie,
        authHeader: () => ({ Authorization: `Bearer ${accessToken}` })
    }
}

export function extractCookieValue(setCookieHeader, cookieName) {
    const cookie = (Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader])
        .find(str => str.startsWith(`${cookieName}=`))

    return cookie ? cookie.split(';')[0].split('=')[1] : null
}
