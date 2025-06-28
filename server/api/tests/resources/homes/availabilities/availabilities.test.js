import request from 'supertest'
import { createUser } from '../../users/users.factory.js'
import { createHome } from '../homes.factory.js'
import { getCsrfToken, loginUser } from '../../../utils/headerHelpers.js'
import { createAvailability } from './availabilities.factory.js'

let Availability, csrfValues

describe('Availability API', () => {
    let authUser, authHeader, otherUser, otherHeader, home, availability

    beforeAll(() => {
        Availability = global.__TEST_STATE__.dbClient.model('Availability')
    })

    beforeEach(async () => {
        authUser = await createUser({ email: 'owner@example.com', password: 'password123' })
        otherUser = await createUser({ email: 'intruder@example.com', password: 'password123' })

        const login1 = await loginUser(global.__TEST_STATE__.app, authUser.email, 'password123')
        const login2 = await loginUser(global.__TEST_STATE__.app, otherUser.email, 'password123')

        authHeader = login1.authHeader()
        otherHeader = login2.authHeader()

        home = await createHome({ owner: authUser._id })
        availability = await createAvailability({ homeId: home._id })

        csrfValues = await getCsrfToken(global.__TEST_STATE__.app)
    })

    describe('POST /api/homes/:homeId/availabilities', () => {
        const payload = {
            availabilities: [1]
        }

        it('creates new availabilities and persists it in DB', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .post(`/api/homes/${home._id}/availabilities`)
                .set('Cookie', csrfValues.csrfCookie)
                .set(csrfValues.csrfHeader())
                .set(authHeader)
                .send(payload)

            expect(res.statusCode).toBe(201)
            expect(res.body[0].epochDate).toBe(1)

            const availabilityInDb = await Availability.find({ homeId: home._id })
            expect(availabilityInDb.length).toBe(1)
        })

        it('ignores existing availabilities', async () => {
            const availabilityEpochs = availability.map(a => a.epochDate)
            const res = await request(global.__TEST_STATE__.app)
                .post(`/api/homes/${home._id}/availabilities`)
                .set('Cookie', csrfValues.csrfCookie)
                .set(csrfValues.csrfHeader())
                .set(authHeader)
                .send({
                    availabilities: availabilityEpochs
                })

            expect(res.statusCode).toBe(201)
            const availabilityInDb = await Availability.find({ homeId: home._id })
            const availabilityEpochsInDb = availabilityInDb.map(a => a.epochDate)
            expect(availabilityEpochs).toEqual(availabilityEpochsInDb)
        })

        it('fails to create availability for non-existent home', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .post('/api/homes/123456789012345678901234/availabilities')
                .set('Cookie', csrfValues.csrfCookie)
                .set(csrfValues.csrfHeader())
                .set(authHeader)
                .send(payload)

            expect(res.statusCode).toBe(500)
        })

        it('fails to create availability without auth', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .post(`/api/homes/${home._id}/availabilities`)
                .set('Cookie', csrfValues.csrfCookie)
                .set(csrfValues.csrfHeader())
                .send(payload)

            expect(res.statusCode).toBe(401)
        })

        it('fails to create availability for another user\'s home', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .post(`/api/homes/${home._id}/availabilities`)
                .set('Cookie', csrfValues.csrfCookie)
                .set(csrfValues.csrfHeader())
                .set(otherHeader)
                .send(payload)

            expect(res.statusCode).toBe(500)
        })

        it('throws error if availability is not sent', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .post(`/api/homes/${home._id}/availabilities`)
                .set('Cookie', csrfValues.csrfCookie)
                .set(csrfValues.csrfHeader())
                .set(otherHeader)
                .send({})

            expect(res.statusCode).toBe(500)
        })
    })

    describe('GET /api/homes/:homeId/availabilities', () => {
        it('retrieves availabilities for a home', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .get(`/api/homes/${home._id}/availabilities`)
                .set(authHeader)

            expect(res.statusCode).toBe(200)
            const availabilityEpochs = availability.map(a => a.epochDate)

            const availabilityInDb = await Availability.find({ homeId: home._id })
            const availabilityEpochsInDb = availabilityInDb.map(a => a.epochDate)
            expect(availabilityEpochs).toEqual(availabilityEpochsInDb)
        })

        it('retrieves availabilities for a home by start and end Epoch', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .get(`/api/homes/${home._id}/availabilities`)
                .query({
                    startEpoch: availability[0].epochDate,
                    endEpoch: availability[0].epochDate
                })
                .set(authHeader)

            expect(res.statusCode).toBe(200)
            expect(Array.isArray(res.body)).toBe(true)
            expect(res.body.length).toBe(1)
            expect(res.body[0]._id).toBe(availability[0]._id.toString())
        })

        it('fails to get availabilities if endEpoch > startEpoch', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .get(`/api/homes/${home._id}/availabilities`)
                .query({
                    startEpoch: availability[0].epochDate + 1,
                    endEpoch: availability[0].epochDate
                })
                .set(authHeader)

            expect(res.statusCode).toBe(500)
        })

        it('fails to retrieve availabilities for non-existent home', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .get('/api/homes/123456789012345678901234/availabilities')
                .set(authHeader)
            expect(res.statusCode).toBe(500)
        })

        it('fails to retrieve availabilities without auth', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .get(`/api/homes/${home._id}/availabilities`)

            expect(res.statusCode).toBe(401)
        })

        it('fails to retrieve availabilities for another user\'s home', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .get(`/api/homes/${home._id}/availabilities`)
                .set(otherHeader)
            expect(res.statusCode).toBe(500)
        })
    })

    describe('DELETE /api/homes/:homeId/availabilities', () => {
        it('deletes availabilities and persists it in DB', async () => {
            const deletedAvailability = availability[0]._id
            const payload = {
                availabilityIds: [deletedAvailability]
            }
            const res = await request(global.__TEST_STATE__.app)
                .delete(`/api/homes/${home._id}/availabilities`)
                .set('Cookie', csrfValues.csrfCookie)
                .set(csrfValues.csrfHeader())
                .set(authHeader)
                .send(payload)
            expect(res.statusCode).toBe(200)

            const availabilityInDb = await Availability.findById(deletedAvailability)
            expect(availabilityInDb).toBeNull()
        })

        it('fails to delete availability for non-existent home', async () => {
            const deletedAvailability = availability[0]._id
            const payload = {
                availabilityIds: [deletedAvailability]
            }
            const res = await request(global.__TEST_STATE__.app)
                .delete('/api/homes/123456789012345678901234/availabilities')
                .set('Cookie', csrfValues.csrfCookie)
                .set(csrfValues.csrfHeader())
                .set(authHeader)
                .send(payload)

            expect(res.statusCode).toBe(500)
        })

        it('fails to delete availability without auth', async () => {
            const deletedAvailability = availability[0]._id
            const payload = {
                availabilityIds: [deletedAvailability]
            }
            const res = await request(global.__TEST_STATE__.app)
                .delete(`/api/homes/${home._id}/availabilities`)
                .set('Cookie', csrfValues.csrfCookie)
                .set(csrfValues.csrfHeader())
                .send(payload)

            expect(res.statusCode).toBe(401)

            const availabilityInDb = await Availability.findById(deletedAvailability)
            expect(availabilityInDb).not.toBeNull()
        })

        it('fails to delete availability for another user\'s home', async () => {
            const deletedAvailability = availability[0]._id
            const payload = {
                availabilityIds: [deletedAvailability]
            }
            const res = await request(global.__TEST_STATE__.app)
                .delete(`/api/homes/${home._id}/availabilities`)
                .set('Cookie', csrfValues.csrfCookie)
                .set(csrfValues.csrfHeader())
                .set(otherHeader)
                .send(payload)

            expect(res.statusCode).toBe(500)
            const availabilityInDb = await Availability.findById(deletedAvailability)
            expect(availabilityInDb).not.toBeNull()
        })
    })
})
