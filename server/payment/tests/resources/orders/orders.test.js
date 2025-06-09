import request from 'supertest'
import { createOrder } from './orders.factory.js'

let app, db, created

beforeAll(async () => {
    app = global.__TEST_STATE__.app
    db = global.__TEST_STATE__.dbClient
})

beforeEach(async () => {
    created = await createOrder('Razorpay')
})

describe('Orders API', () => {
    describe('POST /orders', () => {
        it('creates an order with Razorpay strategy', async () => {
            const payload = {
                type: 'Razorpay',
                bookingId: 'booking_123',
                amount: 250.75,
            }

            const res = await request(app)
                .post('/payment/orders')
                .send(payload)
                .expect(201)

            // Response assertions
            expect(res.body).toMatchObject({
                bookingId: payload.bookingId,
                amount: payload.amount,
                status: 'Pending',
                gateway: {
                    type: 'Razorpay',
                    razorpay: {
                        razorpayOrderId: expect.any(String)
                    }
                }
            })

            // DB assertions
            const orderInDb = await db.order.findUnique({
                where: { bookingId: payload.bookingId },
                include: {
                    gateway: {
                        include: { razorpay: true }
                    }
                }
            })

            expect(orderInDb).not.toBeNull()
            expect(orderInDb.bookingId).toBe(payload.bookingId)
            expect(orderInDb.amount).toBe(payload.amount)
            expect(orderInDb.status).toBe('Pending')
            expect(orderInDb.gateway?.type).toBe('Razorpay')
            expect(orderInDb.gateway?.razorpay?.razorpayOrderId).toEqual(res.body.gateway.razorpay.razorpayOrderId)
        })

        it('returns 400 if strategy is missing', async () => {
            await request(app)
                .post('/payment/orders')
                .send({ bookingId: 'booking_123', amount: 100 })
                .expect(400)
        })

        it('returns 500 if required fields are missing', async () => {
            await request(app)
                .post('/payment/orders')
                .send({ type: 'Razorpay', amount: 100 })
                .expect(500)
        })
    })

    describe('GET /orders/:id', () => {
        it('fetches order by ID', async () => {
            const res = await request(app)
                .get(`/payment/orders/${created.id}`)
                .expect(200)

            expect(res.body).toMatchObject({
                id: created.id,
                bookingId: created.bookingId,
                status: created.status
            })
            expect(res.body.gateway).not.toBeNull()
            expect(res.body.gateway.razorpay).not.toBeNull()
        })

        it('fetches order wihtout gateway', async () => {
            const testOrder = await createOrder()
            const res = await request(app)
                .get(`/payment/orders/${testOrder.id}`)
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
                .expect(404)
        })
    })

})
