import mongoose from 'mongoose'
import request from 'supertest'
import { createUser } from '../users/users.factory.js'
import { createHome } from '../homes/homes.factory.js'
import { createAvailability } from '../homes/availabilities/availabilities.factory.js'
import { createBooking } from './bookings.factory.js'
import { getCsrfToken, loginUser } from '../../utils/headerHelpers.js'
import { faker } from '@faker-js/faker'

let Booking, csrfValues

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
        booking = await createBooking({ home: home._id, user: authUser._id, status: 'Pending' }) // assign one for use
        await createBooking({
            home: home._id,
            user: authUser._id,
            status: 'Success',
            startEpoch: booking.startEpoch + 10,
            endEpoch: booking.endEpoch + 10
        })

        csrfValues = await getCsrfToken(global.__TEST_STATE__.app)
        global.__MOCK_CONFIG__ = {
            payments: {
                createOrderShouldThrowException: false,
                createOrderShouldFail: false
            }
        }
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
                .get('/api/bookings?status=Pending')
                .set(authHeader)

            expect(res.status).toBe(200)
            expect(res.body.length).toBe(1)
            res.body.forEach(b => expect(b.status).toBe('Pending'))
        })

        it('returns empty array if no bookings match status', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .get('/api/bookings?status=Failed')
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
            expect(res.body).toBeNull()
        })
    })

    describe('POST /api/bookings', () => {
        it('creates a new booking and persists it in DB', async () => {
            const payload = {
                homeId: home._id,
                startEpoch: 20000,
                endEpoch: 20002,
                guestCount: 2,
                gateway: "Razorpay"
            }

            const res = await request(global.__TEST_STATE__.app)
                .post('/api/bookings')
                .set('Cookie', csrfValues.csrfCookie)
                .set(csrfValues.csrfHeader())
                .set(otherHeader)
                .send(payload)

            expect(res.status).toBe(201)
            expect(res.body.booking._id).toBeDefined()
            expect(res.body.booking.status).toBe('Pending')

            const dbBooking = await Booking.findById(res.body.booking._id)
            expect(dbBooking).not.toBeNull()

            expect(dbBooking.totalAmount).toBe(home.pricePerNight * 2)
            expect(dbBooking.paymentId).toBe('TEST_PAYMENT_ID')
        })

        it('creates a new booking and persists it in DB even if payment throws exception', async () => {
            global.__MOCK_CONFIG__.payments.createOrderShouldThrowException = true
            const payload = {
                homeId: home._id,
                startEpoch: 20000,
                endEpoch: 20002,
                guestCount: 2,
                gateway: "Razorpay"
            }

            const res = await request(global.__TEST_STATE__.app)
                .post('/api/bookings')
                .set('Cookie', csrfValues.csrfCookie)
                .set(csrfValues.csrfHeader())
                .set(otherHeader)
                .send(payload)

            expect(res.status).toBe(500)

            const dbBooking = await Booking.find({
                home: home._id,
                user: otherUser._id
            })
            expect(dbBooking.length).toBe(1)
        })

        it('creates a new booking and persists it in DB even if payment fails', async () => {
            global.__MOCK_CONFIG__.payments.createOrderShouldFail = true
            const payload = {
                homeId: home._id,
                startEpoch: 20000,
                endEpoch: 20002,
                guestCount: 2,
                gateway: "Razorpay"
            }

            const res = await request(global.__TEST_STATE__.app)
                .post('/api/bookings')
                .set('Cookie', csrfValues.csrfCookie)
                .set(csrfValues.csrfHeader())
                .set(otherHeader)
                .send(payload)

            expect(res.status).toBe(500)

            const dbBooking = await Booking.find({
                home: home._id,
                user: otherUser._id
            })
            expect(dbBooking.length).toBe(1)
        })

        it('fails booking without proper home', async () => {
            const payload = {
                homeId: faker.database.mongodbObjectId(),
                startEpoch: 20000,
                endEpoch: 20002,
                guestCount: 2,
                gateway: "Razorpay"
            }

            const res = await request(global.__TEST_STATE__.app)
                .post('/api/bookings')
                .set('Cookie', csrfValues.csrfCookie)
                .set(csrfValues.csrfHeader())
                .set(otherHeader)
                .send(payload)

            expect(res.status).toBe(500)
        })

        it('fails booking without availability', async () => {
            await createAvailability({ homeId: home._id, num_days: 1, epochDate: 20000 })
            const payload = {
                homeId: home._id,
                startEpoch: 20000,
                endEpoch: 20002,
                guestCount: 2,
                paymentId: 'TEST_PAYMENT_ID',
                gateway: "Razorpay"
            }

            const res = await request(global.__TEST_STATE__.app)
                .post('/api/bookings')
                .set('Cookie', csrfValues.csrfCookie)
                .set(csrfValues.csrfHeader())
                .set(otherHeader)
                .send(payload)

            expect(res.status).toBe(500)
        })

        it('fails booking if hotel is already booked', async () => {
            await createBooking({
                home: home._id,
                user: otherUser._id,
                status: 'Success',
                startEpoch: 20001,
                endEpoch: 20002,
            })

            const payload = {
                homeId: home._id,
                startEpoch: 20000,
                endEpoch: 20002,
                guestCount: 2,
                gateway: "Razorpay"
            }

            const res = await request(global.__TEST_STATE__.app)
                .post('/api/bookings')
                .set('Cookie', csrfValues.csrfCookie)
                .set(csrfValues.csrfHeader())
                .set(otherHeader)
                .send(payload)

            expect(res.status).toBe(500)
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
                .set('Cookie', csrfValues.csrfCookie)
                .set(csrfValues.csrfHeader())
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
                .set('Cookie', csrfValues.csrfCookie)
                .set(csrfValues.csrfHeader())
                .set(otherHeader)
                .send(payload)

            expect(res.status).toBe(500)
        })
    })

    describe('PATCH /api/bookings/:id', () => {
        it('updates a booking if user is authenticated and owns it', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .patch(`/api/bookings/${booking._id}`)
                .set('Cookie', csrfValues.csrfCookie)
                .set(csrfValues.csrfHeader())
                .set(authHeader)
                .send({ status: 'Failed', paymentId: 'asdfg' })

            expect(res.status).toBe(200)
            expect(res.body.status).toBe('Failed')
            expect(res.body.paymentId).toBe('asdfg')

            const dbBooking = await Booking.findById(booking._id)
            expect(dbBooking.status).toBe('Failed')
            expect(dbBooking.paymentId).toBe('asdfg')
        })

        it('updates a booking from webhook with payment headers instead of CSRF / user auth', async () => {
            const { auth_header: pay_header, auth_key: pay_key } = global.__TEST_STATE__.config.paymentAuth
            const res = await request(global.__TEST_STATE__.app)
                .patch(`/api/bookings/${booking._id}`)
                .set(pay_header, pay_key)
                .send({ status: 'Success', paymentId: 'asdfg' })

            expect(res.status).toBe(200)
            expect(res.body.status).toBe('Success')
            expect(res.body.paymentId).toBe('asdfg')

            const dbBooking = await Booking.findById(booking._id)
            expect(dbBooking.status).toBe('Success')
            expect(dbBooking.paymentId).toBe('asdfg')
        })

        it('returns 500 if update is for any field except status', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .patch(`/api/bookings/${booking._id}`)
                .set('Cookie', csrfValues.csrfCookie)
                .set(csrfValues.csrfHeader())
                .set(authHeader)
                .send({ startEpoch: booking.startEpoch - 3 })

            expect(res.status).toBe(500)
        })

        it('returns 401 if not authenticated', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .patch(`/api/bookings/${booking._id}`)
                .set('Cookie', csrfValues.csrfCookie)
                .set(csrfValues.csrfHeader())
                .send({ status: 'Failed' })

            expect(res.status).toBe(401)
        })

        it('returns 404 or error if user does not own booking', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .patch(`/api/bookings/${booking._id}`)
                .set('Cookie', csrfValues.csrfCookie)
                .set(csrfValues.csrfHeader())
                .set(otherHeader)
                .send({ status: 'Failed' })

            expect(res.status).toBe(500)
        })
    })
})
