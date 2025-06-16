import request from 'supertest'
import { getCsrfToken, loginUser } from '../utils/headerHelpers.js'
import { signCSRF } from '../../services/csrf.js'
import cookie from 'cookie'
import { createUser } from '../resources/users/users.factory.js'

let seededUser, csrfValues, authHeader

describe('CSRF API', () => {
    beforeEach(async () => {
        seededUser = await createUser({
            email: 'user@example.com',
            password: 'testpass123'
        })

        const login = await loginUser(global.__TEST_STATE__.app, seededUser.email, 'testpass123')
        authHeader = login.authHeader

        csrfValues = await getCsrfToken(global.__TEST_STATE__.app)
    })

    describe('CSRF middleware', () => {
        it('CSRF is not needed for GET requests', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .get('/api/users')
                .set(authHeader())

            expect(res.statusCode).toBe(200)
        })

        it('GET requests don\'t fail if CSRF is passed', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .get('/api/users')
                .set('Cookie', csrfValues.csrfCookie)
                .set(csrfValues.csrfHeader())
                .set(authHeader())

            expect(res.statusCode).toBe(200)
        })

        it('POST requests return 403 without CSRF', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .post('/api/users')
                .send({
                    email: 'new@example.com',
                    password: 'newpass123',
                    name: 'New User'
                })

            expect(res.statusCode).toBe(403)
        })

        it('POST requests fail with CSRF cookie but no CSRF header', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .post('/api/users')
                .set('Cookie', csrfValues.csrfCookie)
                .send({
                    email: 'new@example.com',
                    password: 'newpass123',
                    name: 'New User'
                })

            expect(res.statusCode).toBe(403)
        })

        it('POST requests fail with CSRF header but no CSRF cookie', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .post('/api/users')
                .set(csrfValues.csrfHeader())
                .send({
                    email: 'new@example.com',
                    password: 'newpass123',
                    name: 'New User'
                })

            expect(res.statusCode).toBe(403)
        })

        it('POST requests fail with tampered cookie 1', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .post('/api/users')
                .set('Cookie', `${csrfValues.csrfCookie}a`)
                .set(csrfValues.csrfHeader())
                .send({
                    email: 'new@example.com',
                    password: 'newpass123',
                    name: 'New User'
                })

            expect(res.statusCode).toBe(500)
        })

        it('POST requests fail with tampered cookie 2', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .post('/api/users')
                .set('Cookie', `${csrfValues.csrfCookie.slice(0, -1)}@`)
                .set(csrfValues.csrfHeader())
                .send({
                    email: 'new@example.com',
                    password: 'newpass123',
                    name: 'New User'
                })

            expect(res.statusCode).toBe(403)
        })

        it('POST requests fail with tampered cookie 3', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .post('/api/users')
                .set('Cookie', `${csrfValues.csrfCookie.split('.')[0]}`)
                .set(csrfValues.csrfHeader())
                .send({
                    email: 'new@example.com',
                    password: 'newpass123',
                    name: 'New User'
                })

            expect(res.statusCode).toBe(403)
        })

        it('POST requests fail with corrupt cookie', async () => {
            const { csrf_secret, csrf_cookie } = global.__TEST_STATE__.config.auth
            const signed = signCSRF('asdfg', csrf_secret)
            const cookieStr = cookie.serialize(csrf_cookie, signed, {
                path: '/',
                secure: true,
                httpOnly: false,
                sameSite: 'Strict',
                expires: new Date(Date.now() + 86400000)
            })
            const res = await request(global.__TEST_STATE__.app)
                .post('/api/users')
                .set('Cookie', cookieStr)
                .set(csrfValues.csrfHeader())
                .send({
                    email: 'new@example.com',
                    password: 'newpass123',
                    name: 'New User'
                })

            expect(res.statusCode).toBe(403)
        })

        it('POST requests fail with expired token', async () => {
            const { csrf_secret, csrf_cookie } = global.__TEST_STATE__.config.auth
            const token = 'asdfg'
            const expiry = Date.now() - 86400000
            const payload = JSON.stringify({ token, expiry })
            const signed = signCSRF(payload, csrf_secret)
            const cookieStr = cookie.serialize(csrf_cookie, signed, {
                path: '/',
                secure: true,
                httpOnly: false,
                sameSite: 'Strict',
                expires: new Date(Date.now() - 86400000)
            })
            const res = await request(global.__TEST_STATE__.app)
                .post('/api/users')
                .set('Cookie', cookieStr)
                .set(csrfValues.csrfHeader())
                .send({
                    email: 'new@example.com',
                    password: 'newpass123',
                    name: 'New User'
                })

            expect(res.statusCode).toBe(403)
        })

        it('POST requests fail with invalid token', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .post('/api/users')
                .set('Cookie', csrfValues.csrfCookie)
                .set({ [csrfValues.csrfHeaderName]: 'asdfg' })
                .send({
                    email: 'new@example.com',
                    password: 'newpass123',
                    name: 'New User'
                })

            expect(res.statusCode).toBe(403)
        })
        it('POST requests pass with CSRF', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .post('/api/users')
                .set('Cookie', csrfValues.csrfCookie)
                .set(csrfValues.csrfHeader())
                .send({
                    email: 'new@example.com',
                    password: 'newpass123',
                    name: 'New User'
                })

            expect(res.statusCode).toBe(201)
        })

        it('PATCH requests return 403 without CSRF', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .patch('/api/users')
                .set(authHeader())
                .send({ name: 'Updated Name' })

            expect(res.statusCode).toBe(403)
        })

        it('PATCH requests pass with CSRF', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .patch('/api/users')
                .set('Cookie', csrfValues.csrfCookie)
                .set(csrfValues.csrfHeader())
                .set(authHeader())
                .send({ name: 'Updated Name' })

            expect(res.statusCode).toBe(200)
        })

        it('DELETE requests return 403 without CSRF', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .delete('/api/users')
                .set(authHeader())

            expect(res.statusCode).toBe(403)
        })

        it('DELETE requests pass with CSRF', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .delete('/api/users')
                .set('Cookie', csrfValues.csrfCookie)
                .set(csrfValues.csrfHeader())
                .set(authHeader())

            expect(res.statusCode).toBe(200)
        })
    })
})
