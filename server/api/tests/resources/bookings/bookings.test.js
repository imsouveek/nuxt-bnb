import mongoose from 'mongoose'
import request from 'supertest'
import { createUser } from '../users/users.factory.js'
import { createHome } from '../homes/homes.factory.js'
import { createBooking } from './bookings.factory.js'
import { loginUser } from '../../utils/loginUser.js'

let Booking

describe('Booking API', () => {
    let authUser, authHeader, otherUser, otherHeader, home, booking

    beforeAll(() => {
        Booking = global.__TEST_STATE__.dbClient.model('Booking')
    })

    beforeEach(async () => {
        authUser = await createUser({ email: 'owner@example.com', password: 'password123' })
        otherUser = await createUser({ email: 'intruder@example.com', password: 'password123' })

        const login1 = await loginUser(global.__TEST_STATE__.app, authUser.email, 'password123')
        const login2 = await loginUser(global.__TEST_STATE__.app, otherUser.email, 'password123')

        authHeader = login1.authHeader()
        otherHeader = login2.authHeader()

        home = await createHome({ owner: authUser._id })
        booking = await createBooking({ homeId: home._id, userId: authUser._id, status: 'pending' }) // assign one for use
        await createBooking({
            homeId: home._id,
            userId: authUser._id,
            status: 'confirmed',
            startEpoch: booking.startEpoch + 10,
            endEpoch: booking.endEpoch + 10
        })
    })

    describe('GET /api/bookings', () => {
        it('returns user bookings', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .get('/api/bookings')
                .set(authHeader)

            expect(res.status).toBe(200)
            expect(Array.isArray(res.body)).toBe(true)
        })

        it('returns bookings even without auth', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .get('/api/bookings')

            expect(res.status).toBe(200)
            expect(Array.isArray(res.body)).toBe(true)
        })

        it('returns multiple bookings for the user', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .get('/api/bookings')
                .set(authHeader)

            expect(res.status).toBe(200)
            expect(res.body.length).toBe(2)
        })

        it('returns multiple bookings for the home', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .get('/api/bookings')
                .query({
                    homeId: home._id.toString()
                })

            expect(res.status).toBe(200)
            expect(res.body.length).toBe(2)
        })

        it('fails for invalid home Id', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .get('/api/bookings')
                .query({
                    homeId: 'asdfg'
                })

            expect(res.status).toBe(500)
        })

        it('filters bookings by status', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .get('/api/bookings?status=pending')
                .set(authHeader)

            expect(res.status).toBe(200)
            expect(res.body.length).toBe(1)
            res.body.forEach(b => expect(b.status).toBe('pending'))
        })

        it('returns empty array if no bookings match status', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .get('/api/bookings?status=cancelled')
                .set(authHeader)

            expect(res.status).toBe(200)
            expect(res.body).toEqual([])
        })

        it('filters bookings by startEpochBefore and endEpochBefore', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .get('/api/bookings')
                .query({
                    startEpochBefore: booking.startEpoch + 1,
                    endEpochBefore: booking.endEpoch + 1
                })
                .set(authHeader)

            expect(res.status).toBe(200)
            expect(Array.isArray(res.body)).toBe(true)
            expect(res.body.length).toBe(1)
            expect(res.body[0]._id).toBe(booking._id.toString())
        })

        it('filters bookings by startEpochBefore and startEpochAfter', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .get('/api/bookings')
                .query({
                    startEpochAfter: booking.startEpoch - 1,
                    startEpochBefore: booking.startEpoch + 1
                })
                .set(authHeader)

            expect(res.status).toBe(200)
            expect(Array.isArray(res.body)).toBe(true)
            expect(res.body.length).toBe(1)
            expect(res.body[0]._id).toBe(booking._id.toString())
        })

        it('filters bookings by endEpochBefore and endEpochAfter', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .get('/api/bookings')
                .query({
                    endEpochAfter: booking.endEpoch - 1,
                    endEpochBefore: booking.endEpoch + 1
                })
                .set(authHeader)

            expect(res.status).toBe(200)
            expect(Array.isArray(res.body)).toBe(true)
            expect(res.body.length).toBe(1)
            expect(res.body[0]._id).toBe(booking._id.toString())
        })
    })

    describe('GET /api/bookings/:id', () => {
        it('returns a single booking', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .get(`/api/bookings/${booking._id}`)
                .set(authHeader)

            expect(res.status).toBe(200)
            expect(res.body._id).toBe(booking._id.toString())
        })

        it('returns a single booking without auth', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .get(`/api/bookings/${booking._id}`)

            expect(res.status).toBe(200)
            expect(res.body._id).toBe(booking._id.toString())
        })

        it('returns {} if booking not found', async () => {
            const fakeId = new mongoose.Types.ObjectId()
            const res = await request(global.__TEST_STATE__.app)
                .get(`/api/bookings/${fakeId}`)
                .set(authHeader)

            expect(res.status).toBe(200)
            expect(res.body).toEqual({})
        })
    })

    describe('POST /api/bookings', () => {
        it('creates a new booking and persists it in DB', async () => {
            const payload = {
                homeId: home._id,
                startEpoch: 20000,
                endEpoch: 20002,
                guestCount: 2,
                paymentId: 'TEST_PAYMENT_ID'
            }

            const res = await request(global.__TEST_STATE__.app)
                .post('/api/bookings')
                .set(authHeader)
                .send(payload)

            expect(res.status).toBe(201)
            expect(res.body._id).toBeDefined()
            expect(res.body.status).toBe('pending')

            const dbBooking = await Booking.findById(res.body._id)
            expect(dbBooking).not.toBeNull()

            expect(dbBooking.totalAmount).toBe(home.pricePerNight * 2)
            expect(dbBooking.paymentId).toBe('TEST_PAYMENT_ID')
        })

        it('rejects booking creation if user is not authenticated', async () => {
            const payload = {
                homeId: home._id,
                startEpoch: 20000,
                endEpoch: 20002,
                guestCount: 2
            }

            const res = await request(global.__TEST_STATE__.app)
                .post('/api/bookings')
                .send(payload)

            expect(res.status).toBe(401)
        })

        it('fails to book without required fields', async () => {
            const payload = {
                homeId: home._id,
                endEpoch: 20002,
                guestCount: 2
            }

            const res = await request(global.__TEST_STATE__.app)
                .post('/api/bookings')
                .set(authHeader)
                .send(payload)

            expect(res.status).toBe(500)
        })
    })

    describe('PATCH /api/bookings/:id', () => {
        it('updates a booking if user is authenticated and owns it', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .patch(`/api/bookings/${booking._id}`)
                .set(authHeader)
                .send({ status: 'cancelled', paymentId: 'asdfg' })

            expect(res.status).toBe(200)
            expect(res.body.status).toBe('cancelled')
            expect(res.body.paymentId).toBe('asdfg')

            const dbBooking = await Booking.findById(booking._id)
            expect(dbBooking.status).toBe('cancelled')
            expect(dbBooking.paymentId).toBe('asdfg')

        })

        it('returns 500 if update is for any field except status', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .patch(`/api/bookings/${booking._id}`)
                .set(authHeader)
                .send({ startEpoch: booking.startEpoch - 3 })

            expect(res.status).toBe(500)
        })

        it('returns 401 if not authenticated', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .patch(`/api/bookings/${booking._id}`)
                .send({ status: 'cancelled' })

            expect(res.status).toBe(401)
        })

        it('returns 404 or error if user does not own booking', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .patch(`/api/bookings/${booking._id}`)
                .set(otherHeader)
                .send({ status: 'cancelled' })

            expect(res.status).toBe(500)
        })
    })
})
