import mongoose from 'mongoose'
import request from 'supertest'
import { createUser } from '../users/users.factory.js'
import { getCsrfToken, loginUser } from '../../utils/headerHelpers.js'
import { createHome } from './homes.factory.js'

let Home, csrfValues

describe('Homes API', () => {
    let authUser, authHeader, otherUser, otherHeader, home

    beforeAll(() => {
        Home = global.__TEST_STATE__.dbClient.model('Home')
    })

    beforeEach(async () => {
        authUser = await createUser({ email: 'owner@example.com', password: 'password123' })
        otherUser = await createUser({ email: 'intruder@example.com', password: 'password123' })

        const login1 = await loginUser(global.__TEST_STATE__.app, authUser.email, 'password123')
        const login2 = await loginUser(global.__TEST_STATE__.app, otherUser.email, 'password123')

        authHeader = login1.authHeader()
        otherHeader = login2.authHeader()

        home = await createHome({ owner: authUser._id })
        csrfValues = await getCsrfToken(global.__TEST_STATE__.app)
    })

    describe('POST /api/homes', () => {
        it('creates a new home and persists it in DB', async () => {
            const payload = {
                title: 'Modern Villa',
                description: 'A test property',
                pricePerNight: 150,
                type: 'VILLA',
                location: {
                    address: 'Test Lane',
                    city: 'TEST CITY',
                    state: 'TS',
                    postalCode: '123456',
                    country: 'IN'
                },
                guests: 4,
                bedrooms: 2,
                beds: 2,
                bathrooms: 2,
                features: ['wifi', 'kitchen']
            }

            const res = await request(global.__TEST_STATE__.app)
                .post('/api/homes')
                .set('Cookie', csrfValues.csrfCookie)
                .set(csrfValues.csrfHeader())
                .set(authHeader)
                .send(payload)

            expect(res.statusCode).toBe(201)
            expect(res.body).toHaveProperty('_id')
            expect(res.body.title).toBe(payload.title)

            const dbHome = await Home.findById(res.body._id)
            expect(dbHome).not.toBeNull()
            expect(dbHome.title).toBe(payload.title)
            expect(dbHome.owner.toString()).toBe(authUser._id.toString())
        })

        it('ignores _id and owner during create', async () => {
            const payload = {
                _id: null,
                owner: 'asdfg12345',
                title: 'Modern Villa',
                description: 'A test property',
                pricePerNight: 150,
                type: 'VILLA',
                location: {
                    address: 'Test Lane',
                    city: 'TEST CITY',
                    state: 'TS',
                    postalCode: '123456',
                    country: 'IN'
                },
                guests: 4,
                bedrooms: 2,
                beds: 2,
                bathrooms: 2,
                features: ['wifi', 'kitchen']
            }

            const res = await request(global.__TEST_STATE__.app)
                .post('/api/homes')
                .set('Cookie', csrfValues.csrfCookie)
                .set(csrfValues.csrfHeader())
                .set(authHeader)
                .send(payload)

            expect(res.statusCode).toBe(201)
            expect(res.body).toHaveProperty('_id')
            expect(res.body.title).toBe(payload.title)

            const dbHome = await Home.findById(res.body._id)
            expect(dbHome).not.toBeNull()
            expect(dbHome.title).toBe(payload.title)
            expect(dbHome.owner.toString()).toBe(authUser._id.toString())

            expect(res.body._id.toString()).toBe(dbHome._id.toString())
            expect(res.body.owner.toString()).toBe(dbHome.owner.toString())
        })

        it('rejects unauthenticated create', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .post('/api/homes')
                .set('Cookie', csrfValues.csrfCookie)
                .set(csrfValues.csrfHeader())
                .send({ title: 'Fail Home' })

            expect(res.statusCode).toBe(401)
        })

        it('fails if request is invalid', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .post('/api/homes')
                .set('Cookie', csrfValues.csrfCookie)
                .set(csrfValues.csrfHeader())
                .set(authHeader)
                .send({ title: 'Fail Home' })

            expect(res.statusCode).toBe(500)
        })
    })

    describe('GET /api/homes', () => {
        it('fetches a specific home', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .get(`/api/homes`)
                .set(authHeader)

            expect(res.statusCode).toBe(200)
            expect(res.body[0]._id).toBe(home._id.toString())
        })
    })

    describe('GET /api/homes/:id', () => {
        it('fetches a specific home', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .get(`/api/homes/${home._id}`)
                .set(authHeader)

            expect(res.statusCode).toBe(200)
            expect(res.body._id).toBe(home._id.toString())
        })

        it('returns 404 for non-existent home', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .get(`/api/homes/${new mongoose.Types.ObjectId()}`)
                .set(authHeader)

            expect(res.statusCode).toBe(404)
        })

        it('returns 500 for invalid home id', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .get(`/api/homes/asdfg`)
                .set(authHeader)

            expect(res.statusCode).toBe(500)
        })

        it('rejects unauthenticated get', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .get(`/api/homes/${home._id}`)

            expect(res.statusCode).toBe(401)
        })
    })

    describe('PATCH /api/homes/:id', () => {
        it('updates a home and reflects in DB', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .patch(`/api/homes/${home._id}`)
                .set('Cookie', csrfValues.csrfCookie)
                .set(csrfValues.csrfHeader())
                .set(authHeader)
                .send({ title: 'Updated Title' })

            expect(res.statusCode).toBe(200)
            expect(res.body.title).toBe('Updated Title')

            const updatedHome = await Home.findById(home._id)
            expect(updatedHome.title).toBe('Updated Title')
        })

        it('rejects update by non-owner', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .patch(`/api/homes/${home._id}`)
                .set('Cookie', csrfValues.csrfCookie)
                .set(csrfValues.csrfHeader())
                .set(otherHeader)
                .send({ title: 'Malicious Update' })

            expect(res.statusCode).toBe(500)

            const unchanged = await Home.findById(home._id)
            expect(unchanged.title).not.toBe('Malicious Update')
        })

        it('rejects unauthenticated update', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .patch(`/api/homes/${home._id}`)
                .set('Cookie', csrfValues.csrfCookie)
                .set(csrfValues.csrfHeader())
                .send({ title: 'No Auth Update' })

            expect(res.statusCode).toBe(401)
        })

        it('rejects updating blocked fields like _id or owner', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .patch(`/api/homes/${home._id}`)
                .set('Cookie', csrfValues.csrfCookie)
                .set(csrfValues.csrfHeader())
                .set(authHeader)
                .send({ _id: new mongoose.Types.ObjectId(), owner: otherUser._id })

            expect(res.statusCode).toBe(500) // or 500 if you throw a general error
            expect(res.body).toHaveProperty('error')
        })
    })

    describe('DELETE /api/homes/:id', () => {
        it('deletes a home by owner and confirms DB removal', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .delete(`/api/homes/${home._id}`)
                .set('Cookie', csrfValues.csrfCookie)
                .set(csrfValues.csrfHeader())
                .set(authHeader)

            expect(res.statusCode).toBe(200)

            const inDb = await Home.findById(home._id)
            expect(inDb).toBeNull()
        })

        it('rejects delete by non-owner', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .delete(`/api/homes/${home._id}`)
                .set('Cookie', csrfValues.csrfCookie)
                .set(csrfValues.csrfHeader())
                .set(otherHeader)

            expect(res.statusCode).toBe(500)

            const stillThere = await Home.findById(home._id)
            expect(stillThere).not.toBeNull()
        })

        it('rejects unauthenticated delete', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .delete(`/api/homes/${home._id}`)
                .set('Cookie', csrfValues.csrfCookie)
                .set(csrfValues.csrfHeader())

            expect(res.statusCode).toBe(401)
        })
    })
})
