import request from 'supertest'
import bcrypt from 'bcryptjs'
import { createUser } from '../users/users.factory.js'

let User, Token

describe('Auth API', () => {
    let seededUser

    beforeAll(() => {
        Token = global.__TEST_STATE__.dbClient.model('Token')
        User = global.__TEST_STATE__.dbClient.model('User')
    })

    beforeEach(async () => {
        // Optional: You can reuse or override seeded users for each test
        seededUser = await createUser({
            email: 'test@example.com',
            password: 'password123'
        })
    })

    describe('Login', () => {
        it('fails to login unknown user', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .post('/api/auth/login')
                .send({
                    email: 'asdfg@test.com',
                    password: 'password123'
                })
            expect(res.statusCode).toBe(401)
            expect(res.body).toHaveProperty('error')
        })

        it('fails to login with wrong password', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .post('/api/auth/login')
                .send({
                    email: seededUser.email,
                    password: 'wrongpassword'
                })
            expect(res.statusCode).toBe(401)
            expect(res.body).toHaveProperty('error')

            const loggedIn = await User.findOne({ email: seededUser.email })
            expect(loggedIn.tokens.length).toBe(0)
        })

        it('logs in and receives refresh + access tokens', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .post('/api/auth/login')
                .send({
                    email: seededUser.email,
                    password: 'password123'
                })

            expect(res.statusCode).toBe(200)
            expect(res.body).toHaveProperty('access_token')
            expect(res.headers['set-cookie'][0]).toMatch(new RegExp(global.__TEST_STATE__.config.auth.refresh_cookie))
            expect(res.headers['set-cookie'][0]).toMatch(/HttpOnly/)
            expect(res.headers['set-cookie'][0]).toMatch(/Secure/)
            expect(res.headers['set-cookie'][0]).toMatch(/SameSite=None/)
            const loggedIn = await User.findOne({ email: seededUser.email })
            expect(loggedIn.tokens.length).toBe(1)
            const cookieValue = res.headers['set-cookie'][0].split(';')[0].split('=')[1]
            expect(loggedIn.tokens[0].token).toMatch(cookieValue)
        })

        it('does\'t allow google users to login with password', async () => {
            const res1 = await request(global.__TEST_STATE__.app)
                .post('/api/auth/google-auth')
                .send({ token: 'fake-google-id-token' })

            const res2 = await request(global.__TEST_STATE__.app)
                .post('/api/auth/login')
                .send({
                    email: res1.body.user.email,
                    password: 'password123'
                })

            expect(res2.statusCode).toBe(401)
        })
    })

    describe('Auth Token refresh', () => {
        it('refreshes access token using refresh cookie', async () => {
            const login = await request(global.__TEST_STATE__.app)
                .post('/api/auth/login')
                .send({ email: seededUser.email, password: 'password123' })

            const cookie = login.headers['set-cookie']
            const res = await request(global.__TEST_STATE__.app)
                .post('/api/auth/refresh')
                .set('Cookie', cookie)

            expect(res.statusCode).toBe(200)
            expect(res.body).toHaveProperty('access_token')

            const loggedIn = await User.findOne({ email: seededUser.email })
            expect(loggedIn.tokens.length).toBe(1)
        })

        it('fails to refresh token with invalid cookie', async () => {
            await request(global.__TEST_STATE__.app)
                .post('/api/auth/login')
                .send({ email: seededUser.email, password: 'password123' })

            const res = await request(global.__TEST_STATE__.app)
                .post('/api/auth/refresh')
                .set('Cookie', '1234')

            expect(res.statusCode).toBe(401)
        })

        it('fails to refresh token without cookie', async () => {
            await request(global.__TEST_STATE__.app)
                .post('/api/auth/login')
                .send({ email: seededUser.email, password: 'password123' })

            const res = await request(global.__TEST_STATE__.app)
                .post('/api/auth/refresh')

            expect(res.statusCode).toBe(401)
        })
    })

    describe('Forgot Password', () => {
        it('sends reset email ', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .post('/api/auth/forgot')
                .send({ email: seededUser.email })

            expect(res.statusCode).toBe(200)

            const tokenRecord = await Token.findOne({ type: 'password' })
            expect(tokenRecord).toBeTruthy()
            expect(tokenRecord.email).toBe(seededUser.email)

            const apiResponse = await fetch(`${global.__TEST_STATE__.smtpUrl}/api/v1/messages`).then(res => res.json()).catch(err => console.error(err))
            expect(apiResponse.messages[0].To[0].Address).toEqual(seededUser.email)

            const linkResponse = await fetch(
                `${global.__TEST_STATE__.smtpUrl}/api/v1/message/latest/link-check`
            )
                .then(res => res.json())
                .catch(err => console.error(err))
            expect(linkResponse.Links[0].URL).toBe(`${global.__TEST_STATE__.config.url.app}/auth/reset/${tokenRecord.token}`)
        })

        it('maintains only one password reset token', async () => {
            await Token.create({
                email: seededUser.email,
                type: 'password'
            })

            const res = await request(global.__TEST_STATE__.app)
                .post('/api/auth/forgot')
                .send({ email: seededUser.email })

            expect(res.statusCode).toBe(200)

            const tokenRecord = await Token.findOne({ type: 'password' })
            expect(tokenRecord).toBeTruthy()
            expect(tokenRecord.email).toBe(seededUser.email)

            const apiResponse = await fetch(`${global.__TEST_STATE__.smtpUrl}/api/v1/messages`).then(res => res.json()).catch(err => console.error(err))
            expect(apiResponse.messages[0].To[0].Address).toEqual(seededUser.email)

            const linkResponse = await fetch(
                `${global.__TEST_STATE__.smtpUrl}/api/v1/message/latest/link-check`
            )
                .then(res => res.json())
                .catch(err => console.error(err))
            expect(linkResponse.Links[0].URL).toBe(`${global.__TEST_STATE__.config.url.app}/auth/reset/${tokenRecord.token}`)
        })

        it('fails to send reset email for invalid email id', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .post('/api/auth/forgot')
                .send({ email: 'test' })

            expect(res.statusCode).toBe(500)
        })
    })

    describe('Reset password', () => {
        it('fails to reset password with wrong token', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .post('/api/auth/reset')
                .send({ token: 'fake-token', password: 'newpass' })

            expect(res.statusCode).toBe(401)
        })

        it('fails to reset password for google login users', async () => {
            const googleUser = await createUser({
                authStrategy: 'google'
            })

            const tokenRecord = await Token.create({
                email: googleUser.email,
                type: 'password'
            })

            const res = await request(global.__TEST_STATE__.app)
                .post('/api/auth/reset')
                .send({ token: tokenRecord.token, password: 'newpass' })

            expect(res.statusCode).toBe(500)
        })

        it('resets password using valid token', async () => {
            const tokenRecord = await Token.create({
                email: seededUser.email,
                type: 'password'
            })

            const res = await request(global.__TEST_STATE__.app)
                .post(`/api/auth/reset`)
                .send({
                    token: tokenRecord.token,
                    password: 'newpassword456'
                })

            expect(res.statusCode).toBe(200)
            const tokenGone = await Token.findOne({ token: tokenRecord.token })
            expect(tokenGone).toBeNull()

            const updated = await User.findOne({ email: seededUser.email })
            const passwordMatches = await bcrypt.compare('newpassword456', updated.password)
            expect(passwordMatches).toBe(true)
        })

        it('fails to reset password using wrong token type', async () => {
            const tokenRecord = await Token.create({
                email: seededUser.email,
                type: 'image'
            })

            const res = await request(global.__TEST_STATE__.app)
                .post(`/api/auth/reset`)
                .send({
                    token: tokenRecord.token,
                    password: 'newpassword456'
                })

            expect(res.statusCode).toBe(401)
        })
    })

    describe('POST /api/auth/google', () => {
        it('logs in or creates user using valid Google token', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .post('/api/auth/google-auth')
                .send({ token: 'fake-google-id-token' })

            expect(res.statusCode).toBe(200)
            expect(res.body).toHaveProperty('access_token')
            expect(res.headers['set-cookie'][0]).toMatch(
                new RegExp(global.__TEST_STATE__.config.auth.refresh_cookie)
            )

            const user = await User.findOne({ email: 'googleuser@example.com' })
            expect(user).toBeTruthy()
            expect(user.name).toBe('Google User')
        })

        it('logs in or creates user using valid Google token', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .post('/api/auth/google-auth')
                .send({ token: 'fail-token' })

            expect(res.statusCode).toBe(401)
        })
    })
})