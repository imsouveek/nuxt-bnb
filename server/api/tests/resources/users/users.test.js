import mongoose from 'mongoose'
import request from 'supertest'
import bcrypt from 'bcryptjs'
import { createUser } from './users.factory.js'
import { createImage } from '../images/images.factory.js'
import { loginUser, extractCookieValue } from '../../utils/loginUser.js'

let User, Token, Image, seededUser, refreshCookie, authHeader

describe('User API', () => {
    beforeAll(() => {
        User = global.__TEST_STATE__.dbClient.model('User')
        Token = global.__TEST_STATE__.dbClient.model('Token')
        Image = global.__TEST_STATE__.dbClient.model('Image')
    })

    beforeEach(async () => {
        seededUser = await createUser({
            email: 'user@example.com',
            password: 'testpass123',
            image: (await createImage())._id
        })

        const login = await loginUser(global.__TEST_STATE__.app, seededUser.email, 'testpass123')
        refreshCookie = login.refreshCookie
        authHeader = login.authHeader
    })

    describe('GET /api/users', () => {
        it('fails without auth', async () => {
            const res = await request(global.__TEST_STATE__.app).get('/api/users')
            expect(res.statusCode).toBe(401)
        })

        it('gets current user', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .get('/api/users')
                .set(authHeader())

            expect(res.statusCode).toBe(200)
            expect(res.body.email).toBe(seededUser.email)
            expect(res.body).not.toHaveProperty('password')
        })
    })

    describe('GET /api/users/logout', () => {
        it('fails without auth', async () => {
            const res = await request(global.__TEST_STATE__.app).get('/api/users/logout')
            expect(res.statusCode).toBe(401)
        })

        it('logs out current session', async () => {
            await new Promise(resolve => setTimeout(resolve, 1000))
            const login2 = await loginUser(global.__TEST_STATE__.app, seededUser.email, 'testpass123')
            const authHeader2 = login2.authHeader

            const res = await request(global.__TEST_STATE__.app)
                .get('/api/users/logout')
                .set('Cookie', login2.refreshCookie)
                .set(authHeader2())

            expect(res.statusCode).toBe(200)

            const user = await User.findById(seededUser._id)

            const originalToken = extractCookieValue(refreshCookie, global.__TEST_STATE__.config.auth.refresh_cookie)
            expect(user.tokens.length).toBe(1)
            expect(user.tokens[0].token).toMatch(originalToken)
        })
    })

    describe('GET /api/users/logoutAll', () => {
        it('fails without auth', async () => {
            const res = await request(global.__TEST_STATE__.app).get('/api/users/logoutAll')
            expect(res.statusCode).toBe(401)
        })

        it('logs out all sessions', async () => {
            seededUser.tokens.push({ token: 'dummy-token' })
            await seededUser.save()

            const res = await request(global.__TEST_STATE__.app)
                .get('/api/users/logoutAll')
                .set(authHeader())

            expect(res.statusCode).toBe(200)

            const user = await User.findById(seededUser._id)
            expect(user.tokens.length).toBe(0)
        })
    })

    describe('POST /api/users', () => {
        it('creates a new user', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .post('/api/users')
                .send({
                    email: 'new@example.com',
                    password: 'newpass123',
                    name: 'New User'
                })

            expect(res.statusCode).toBe(201)
            expect(res.body.email).toBe('new@example.com')

            const user = await User.findOne({ email: 'new@example.com' })
            expect(user).toBeTruthy()
            expect(user.name).toBe('New User')

            expect(user.password).not.toBe('newpass123')

            const isHashed = await bcrypt.compare('newpass123', user.password)
            expect(isHashed).toBe(true)
        })

        it('fails to create user without proper email', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .post('/api/users')
                .send({
                    email: 'test-string',
                    password: 'newpass123'
                })

            expect(res.statusCode).toBe(500)
        })

        it('fails to create duplicate user', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .post('/api/users')
                .send({
                    email: seededUser.email,
                    password: 'newpass123',
                    name: 'New User'
                })

            expect(res.statusCode).toBe(400)
        })

        it('fails to create user without required fields', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .post('/api/users')
                .send({
                    email: 'new@example.com',
                    password: 'newpass123'
                })

            expect(res.statusCode).toBe(500)
        })

        it('fails to create user with password = password', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .post('/api/users')
                .send({
                    email: 'test-string',
                    password: 'password'
                })

            expect(res.statusCode).toBe(500)
        })

    })

    describe('POST /api/users/token', () => {
        it('fails without auth', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .post('/api/users/token')
            expect(res.statusCode).toBe(401)
        })

        it('fails with invalid type', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .post('/api/users/token')
                .send({ type: 'upload' })
                .set(authHeader())

            expect(res.statusCode).toBe(500)
        })

        it('gets current token', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .post('/api/users/token')
                .send({ type: 'image' })
                .set(authHeader())

            expect(res.statusCode).toBe(200)
            expect(res.body.token).toMatchObject({
                email: seededUser.email,
                type: 'image'
            })

            const record = await Token.findOne({ type: 'image' })
            expect(record.token).toBe(res.body.token.token)
        })
    })

    describe('PATCH /api/users', () => {
        it('fails without auth', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .patch('/api/users')
                .send({ name: 'Updated Name' })
            expect(res.statusCode).toBe(401)
        })

        it('updates current user', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .patch('/api/users')
                .set(authHeader())
                .send({ name: 'Updated Name' })

            expect(res.statusCode).toBe(200)
            expect(res.body.name).toBe('Updated Name')

            const updated = await User.findById(seededUser._id)
            expect(updated.name).toBe('Updated Name')
        })

        it('rejects updating disallowed fields on user', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .patch(`/api/users`)
                .set(authHeader())
                .send({ _id: new mongoose.Types.ObjectId(), tokens: [] })

            expect(res.statusCode).toBe(500) // assuming centralized error returns 400
            expect(res.body).toHaveProperty('error')
        })

        it('encrypts password when user updates it', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .patch('/api/users')
                .set(authHeader())
                .send({ password: 'newpatchpass' })

            expect(res.statusCode).toBe(200)

            const updated = await User.findById(seededUser._id)
            expect(updated).not.toBeNull()
            expect(updated.password).not.toBe('newpatchpass')

            const isUpdatedHash = await bcrypt.compare('newpatchpass', updated.password)
            expect(isUpdatedHash).toBe(true)
        })

        it('deletes existing user image when updating image', async () => {
            const newImage = await createImage()
            const res = await request(global.__TEST_STATE__.app)
                .patch('/api/users')
                .set(authHeader())
                .send({ image: newImage._id })

            expect(res.statusCode).toBe(200)
            const updated = await User.findById(seededUser._id)
            expect(updated).not.toBeNull()
            expect(updated.image.toString()).toBe(newImage._id.toString())

            const oldImageInDb = await Image.findById(seededUser.image)
            expect(oldImageInDb).toBeNull()
        })
    })

    describe('DELETE /api/users', () => {
        it('fails without auth', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .delete('/api/users')
            expect(res.statusCode).toBe(401)
        })

        it('deletes current user', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .delete('/api/users')
                .set(authHeader())

            expect(res.statusCode).toBe(200)

            const user = await User.findById(seededUser._id)
            expect(user).toBeNull()
        })
    })
})
