import request from 'supertest'
import create from './orders.factory.js'

const { createOrder, verifyOrder } = create()

let app, auth

const gatewayTypes = ['Razorpay']

beforeAll(async () => {
    app = global.__TEST_STATE__.app
    auth = global.__TEST_STATE__.config.auth
})

describe('Orders API', () => {
    describe('POST /orders', () => {
        for (const type of gatewayTypes) {
            const gatewayKey = type.toLowerCase()

            it(`creates an order with ${type} strategy`, async () => {
                const payload = {
                    type,
                    bookingId: `booking_${gatewayKey}_create`,
                    amount: 250.75,
                }

                const res = await request(app)
                    .post('/payment/orders')
                    .set(auth.auth_header, auth.auth_key)
                    .send(payload)
                    .expect(201)

                await verifyOrder(type, {
                    responseBody: res.body,
                    payload,
                    status: 'Pending'
                })
            })

            it(`falls back gracefully when ${type} order fails`, async () => {
                global.__MOCK_CONFIG__[type] = { createOrderShouldFail: true }

                const payload = {
                    type,
                    bookingId: `booking_${gatewayKey}_fail`,
                    amount: 100
                }

                const res = await request(app)
                    .post('/payment/orders')
                    .set(auth.auth_header, auth.auth_key)
                    .send(payload)
                    .expect(201)

                await verifyOrder(type, {
                    responseBody: res.body,
                    payload,
                    status: 'New'
                })
            })
        }

        it('returns 400 if strategy is missing', async () => {
            await request(app)
                .post('/payment/orders')
                .set(auth.auth_header, auth.auth_key)
                .send({ bookingId: 'booking_missing_strategy', amount: 100 })
                .expect(400)
        })

        it('returns 500 if required fields are missing', async () => {
            await request(app)
                .post('/payment/orders')
                .set(auth.auth_header, auth.auth_key)
                .send({ type: 'Razorpay', amount: 100 })
                .expect(500)
        })

        it('returns 401 if auth key is not set', async () => {
            const payload = {
                type: 'Razorpay',
                bookingId: 'no_auth_booking',
                amount: 100
            }
            await request(app)
                .post('/payment/orders')
                .send(payload)
                .expect(401)
        })
    })

    describe('GET /orders/:id', () => {
        for (const type of gatewayTypes) {
            const gatewayKey = type.toLowerCase()

            it(`fetches ${type} order by ID`, async () => {
                const created = await createOrder(type)

                const res = await request(app)
                    .get(`/payment/orders/${created.id}`)
                    .set(auth.auth_header, auth.auth_key)
                    .expect(200)

                expect(res.body).toMatchObject({
                    id: created.id,
                    bookingId: created.bookingId,
                    status: created.status
                })

                expect(res.body.gateway).not.toBeNull()
                expect(res.body.gateway[gatewayKey]).not.toBeNull()
            })
        }

        it('fetches order without gateway', async () => {
            const testOrder = await createOrder() // empty gatewayType
            const res = await request(app)
                .get(`/payment/orders/${testOrder.id}`)
                .set(auth.auth_header, auth.auth_key)
                .expect(200)

            expect(res.body).toMatchObject({
                id: testOrder.id,
                bookingId: testOrder.bookingId,
                status: testOrder.status
            })

            expect(res.body.gateway).toBeNull()
        })

        it('returns 404 for non-existent order', async () => {
            await request(app)
                .get('/payment/orders/99999')
                .set(auth.auth_header, auth.auth_key)
                .expect(404)
        })

        it('returns 401 if auth is missing', async () => {
            const testOrder = await createOrder()
            await request(app)
                .get(`/payment/orders/${testOrder.id}`)
                .expect(401)
        })
    })
})
