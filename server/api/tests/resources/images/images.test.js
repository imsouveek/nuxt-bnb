import request from 'supertest'
import { createUser } from '../users/users.factory.js'
import { getCsrfToken, loginUser } from '../../utils/headerHelpers.js'
import { createImage, generateFakeImageUrl, generateBase64Jpeg } from './images.factory.js'

let Image, csrfValues

describe('Image API', () => {
    let authUser, authHeader, otherUser, otherHeader, image

    beforeAll(() => {
        Image = global.__TEST_STATE__.dbClient.model('Image')
    })

    beforeEach(async () => {
        authUser = await createUser({ email: 'owner@example.com', password: 'password123' })
        otherUser = await createUser({ email: 'intruder@example.com', password: 'password123' })

        const login1 = await loginUser(global.__TEST_STATE__.app, authUser.email, 'password123')
        const login2 = await loginUser(global.__TEST_STATE__.app, otherUser.email, 'password123')

        authHeader = login1.authHeader()
        otherHeader = login2.authHeader()

        image = await createImage()
        csrfValues = await getCsrfToken(global.__TEST_STATE__.app)
    })

    describe('POST /api/images', () => {
        let payload

        beforeEach(async () => {
            payload = {
                data: await generateBase64Jpeg(),
            }
        })

        it('uploads a base64 image and returns its ID', async () => {
            const token = await request(global.__TEST_STATE__.app)
                .post('/api/users/token')
                .set('Cookie', csrfValues.csrfCookie)
                .set(csrfValues.csrfHeader())
                .set(authHeader)
                .send({ type: 'image' })

            const uploadToken = token.body.token.token

            const res = await request(global.__TEST_STATE__.app)
                .post('/api/images')
                .set('Cookie', csrfValues.csrfCookie)
                .set(csrfValues.csrfHeader())
                .set(authHeader)
                .set('upload-token', uploadToken)
                .send(payload)

            expect(res.statusCode).toBe(201)
            expect(res.body).toHaveProperty('id')
            const imageId = res.body.id

            const imageInDb = await Image.findById(imageId)
            expect(imageInDb).not.toBeNull()
            expect(imageInDb.imageData.startsWith('data:image/jpeg;base64,')).toBe(true)
        })

        it('uploads a url image and returns its ID', async () => {
            const token = await request(global.__TEST_STATE__.app)
                .post('/api/users/token')
                .set('Cookie', csrfValues.csrfCookie)
                .set(csrfValues.csrfHeader())
                .set(authHeader)
                .send({ type: 'image' })

            const uploadToken = token.body.token.token

            const res = await request(global.__TEST_STATE__.app)
                .post('/api/images')
                .set('Cookie', csrfValues.csrfCookie)
                .set(csrfValues.csrfHeader())
                .set(authHeader)
                .set('upload-token', uploadToken)
                .send({
                    data: generateFakeImageUrl()
                })

            expect(res.statusCode).toBe(201)
            expect(res.body).toHaveProperty('id')
            const imageId = res.body.id

            const imageInDb = await Image.findById(imageId)
            expect(imageInDb).not.toBeNull()
            expect(imageInDb.url).toBeTruthy()
        })

        it('fails to uplaod anything except images and urls', async () => {
            const token = await request(global.__TEST_STATE__.app)
                .post('/api/users/token')
                .set('Cookie', csrfValues.csrfCookie)
                .set(csrfValues.csrfHeader())
                .set(authHeader)
                .send({ type: 'image' })

            const uploadToken = token.body.token.token

            const res = await request(global.__TEST_STATE__.app)
                .post('/api/images')
                .set('Cookie', csrfValues.csrfCookie)
                .set(csrfValues.csrfHeader())
                .set(authHeader)
                .set('upload-token', uploadToken)
                .send({
                    data: 'test-string'
                })

            expect(res.statusCode).toBe(500)
        })

        it('fails image upload without auth', async () => {
            const token = await request(global.__TEST_STATE__.app)
                .post('/api/users/token')
                .set('Cookie', csrfValues.csrfCookie)
                .set(csrfValues.csrfHeader())
                .set(authHeader)
                .send({ type: 'image' })
            const uploadToken = token.body.token.token

            const res = await request(global.__TEST_STATE__.app)
                .post('/api/images')
                .set('Cookie', csrfValues.csrfCookie)
                .set(csrfValues.csrfHeader())
                .set('upload-token', uploadToken)
                .send(payload)

            expect(res.statusCode).toBe(401)
        })

        it('fails without upload token', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .post('/api/images')
                .set('Cookie', csrfValues.csrfCookie)
                .set(csrfValues.csrfHeader())
                .set(authHeader)
                .set('upload-token', 'uploadToken')
                .send(payload)

            expect(res.statusCode).toBe(500)
        })

        it('fails with upload token not existing in backend', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .post('/api/images')
                .set('Cookie', csrfValues.csrfCookie)
                .set(csrfValues.csrfHeader())
                .set(authHeader)
                .send(payload)

            expect(res.statusCode).toBe(400)
        })

        it('fails with mismatched token and user', async () => {
            const token = await request(global.__TEST_STATE__.app)
                .post('/api/users/token')
                .set('Cookie', csrfValues.csrfCookie)
                .set(csrfValues.csrfHeader())
                .set(otherHeader)
                .send({ type: 'image' })
            const wrongToken = token.body.token.token

            const res = await request(global.__TEST_STATE__.app)
                .post('/api/images')
                .set('Cookie', csrfValues.csrfCookie)
                .set(csrfValues.csrfHeader())
                .set(authHeader)
                .set('upload-token', wrongToken)
                .send(payload)

            expect(res.statusCode).toBe(403)
        })
    })

    describe('GET /api/images/:id', () => {

        it('retrieves the image as JPEG binary', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .get(`/api/images/${image._id}`)

            expect(res.statusCode).toBe(200)
            expect(res.headers['content-type']).toBe('image/jpeg')
        })

        it('resizes image using width and height query parameters', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .get(`/api/images/${image._id}?width=50&height=50`)

            expect(res.statusCode).toBe(200)
            expect(res.headers['content-type']).toBe('image/jpeg')
            expect(res.body.length).toBeGreaterThan(0) // or use buffer size heuristics
        })

        it('ignores invalid width and height values', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .get(`/api/images/${image._id}?width=abc&height=xyz`)

            expect(res.statusCode).toBe(200)
            expect(res.headers['content-type']).toBe('image/jpeg')
        })

        it('applies fit option when provided', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .get(`/api/images/${image._id}?width=100&height=100&fit=contain`)

            expect(res.statusCode).toBe(200)
        })
        it('returns 500 for non-existent image ID', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .get('/api/images/123456789012345678901234')

            expect(res.statusCode).toBe(500)
        })

        it('can download url images', async () => {
            const token1 = await request(global.__TEST_STATE__.app)
                .post('/api/users/token')
                .set('Cookie', csrfValues.csrfCookie)
                .set(csrfValues.csrfHeader())
                .set(authHeader)
                .send({ type: 'image' })

            const uploadToken1 = token1.body.token.token

            const res1 = await request(global.__TEST_STATE__.app)
                .post('/api/images')
                .set('Cookie', csrfValues.csrfCookie)
                .set(csrfValues.csrfHeader())
                .set(authHeader)
                .set('upload-token', uploadToken1)
                .send({
                    data: generateFakeImageUrl()
                })

            const res2 = await request(global.__TEST_STATE__.app)
                .get(`/api/images/${res1.body.id}?width=100&height=100&fit=contain`)

            expect(res2.statusCode).toBe(200)
        })
    })

    describe('DELETE /api/images/:id', () => {
        it('deletes an image with valid token', async () => {
            const token = await request(global.__TEST_STATE__.app)
                .post('/api/users/token')
                .set('Cookie', csrfValues.csrfCookie)
                .set(csrfValues.csrfHeader())
                .set(authHeader)
                .send({ type: 'image' })
            const uploadToken = token.body.token.token

            const res = await request(global.__TEST_STATE__.app)
                .delete(`/api/images/${image._id}`)
                .set('Cookie', csrfValues.csrfCookie)
                .set(csrfValues.csrfHeader())
                .set(authHeader)
                .set('upload-token', uploadToken)

            expect(res.statusCode).toBe(200)

            const imageInDb = await Image.findById(image._id)
            expect(imageInDb).toBeNull()
        })

        it('fails to delete invalid image', async () => {
            const token = await request(global.__TEST_STATE__.app)
                .post('/api/users/token')
                .set('Cookie', csrfValues.csrfCookie)
                .set(csrfValues.csrfHeader())
                .set(authHeader)
                .send({ type: 'image' })
            const uploadToken = token.body.token.token

            const res = await request(global.__TEST_STATE__.app)
                .delete(`/api/images/asdf`)
                .set('Cookie', csrfValues.csrfCookie)
                .set(csrfValues.csrfHeader())
                .set(authHeader)
                .set('upload-token', uploadToken)

            expect(res.statusCode).toBe(500)
        })

        it('fails to delete without auth', async () => {
            const token = await request(global.__TEST_STATE__.app)
                .post('/api/users/token')
                .set('Cookie', csrfValues.csrfCookie)
                .set(csrfValues.csrfHeader())
                .set(authHeader)
                .send({ type: 'image' })
            const uploadToken = token.body.token.token

            const res = await request(global.__TEST_STATE__.app)
                .delete(`/api/images/${image._id}`)
                .set('Cookie', csrfValues.csrfCookie)
                .set(csrfValues.csrfHeader())
                .set('upload-token', uploadToken)

            expect(res.statusCode).toBe(401)
        })

        it('fails to delete without token', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .delete(`/api/images/${image._id}`)
                .set('Cookie', csrfValues.csrfCookie)
                .set(csrfValues.csrfHeader())
                .set(authHeader)

            expect(res.statusCode).toBe(400)
        })

        it('fails to delete with mismatched user token', async () => {
            const token = await request(global.__TEST_STATE__.app)
                .post('/api/users/token')
                .set('Cookie', csrfValues.csrfCookie)
                .set(csrfValues.csrfHeader())
                .set(otherHeader)
                .send({ type: 'image' })
            const wrongToken = token.body.token.token

            const res = await request(global.__TEST_STATE__.app)
                .delete(`/api/images/${image._id}`)
                .set('Cookie', csrfValues.csrfCookie)
                .set(csrfValues.csrfHeader())
                .set(authHeader)
                .set('upload-token', wrongToken)

            expect(res.statusCode).toBe(403)
        })
    })
})
