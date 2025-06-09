import request from 'supertest'
import { createOrder } from './orders.factory.js'

let app, orders, now

beforeAll(async () => {
    app = global.__TEST_STATE__.app
})

beforeEach(async () => {
    now = Date.now()
    orders = []
    for (let i = 0; i < 5; ++i) {
        const createdAt = new Date(now + i * 3 * 24 * 60 * 60 * 1000) // 3 days apart

        const order = await createOrder(
            i == 0 ? '' : 'Razorpay', {
            bookingId: `paginated_${i}`,
            amount: 100 + i,
            status: i < 2 ? 'Pending' : 'Success',
            createdAt
        })

        orders.push(order)
    }
})

describe('QueryParams Tests', () => {
    describe('GET /orders with filters', () => {
        it('filters orders by bookingId', async () => {
            const res = await request(app)
                .get(`/payment/orders?bookingId=${orders[0].bookingId}`)
                .expect(200)

            expect(res.body.length).toBe(1)
            expect(res.body[0].bookingId).toBe(orders[0].bookingId)
        })

        it('returns 404 if invalid bookingId is pased', async () => {
            await request(app)
                .get('/payment/orders?bookingId=missing')
                .expect(404)
        })

        it('filters orders by gatewayType', async () => {
            const expectedBookingIds = orders.slice(1).map(order => order.bookingId)

            const res = await request(app)
                .get('/payment/orders?gatewayType=Razorpay')
                .expect(200)

            const returnedBookingIds = res.body.map(order => order.bookingId)
            expect(returnedBookingIds).toEqual(expect.arrayContaining(expectedBookingIds))
            expect(returnedBookingIds.length).toBe(expectedBookingIds.length)
        })

        it('returns 500 if invalid gatewayType is passed', async () => {
            await request(app)
                .get('/payment/orders?gatewayType=abcd')
                .expect(500)

        })

        it('respects status parameter', async () => {
            const res = await request(app)
                .get('/payment/orders?status=Success')
                .expect(200)

            expect(res.body.length).toBe(3)
        })

        it('ignores createdAfter if it is not a date', async () => {
            const res = await request(app)
                .get('/payment/orders?createdAfter=abcd')
                .expect(200)

            expect(res.body.length).toBe(5)
        })

        it('ignores createdBefore if it is not a date', async () => {
            const res = await request(app)
                .get('/payment/orders?createdBefore=abcd')
                .expect(200)

            expect(res.body.length).toBe(5)
        })

        it('fetches orders within createdAfter and createdBefore', async () => {
            const createdAfter = (new Date(now - 86400000)).toString()
            const createdBefore = (new Date(now + 86400000))
            const res = await request(app)
                .get(`/payment/orders?createdAfter=${createdAfter}&createdBefore=${createdBefore}`)
                .expect(200)
            expect(res.body.length).toBe(1)
        })
    })

    describe('GET /orders with pagination and sorting', () => {
        it('respects limit parameter', async () => {
            const res = await request(app)
                .get('/payment/orders?limit=2')
                .expect(200)

            expect(res.body.length).toBe(2)
        })

        it('ignores non-numeric limit parameter', async () => {
            const res = await request(app)
                .get('/payment/orders?limit=a')
                .expect(200)

            expect(res.body.length).toBe(5)
        })

        it('respects skip parameter', async () => {
            const res = await request(app)
                .get('/payment/orders?limit=2&skip=4')
                .expect(200)

            expect(res.body.length).toBe(1)
        })

        it('respects sortBy=amount_asc', async () => {
            const res = await request(app)
                .get('/payment/orders?sortBy=amount_asc')
                .expect(200)

            expect(res.body[0].amount).toBeLessThanOrEqual(res.body[1].amount)
        })

        it('respects sortBy=amount_desc', async () => {
            const res = await request(app)
                .get('/payment/orders?sortBy=amount_desc')
                .expect(200)

            expect(res.body[0].amount).toBeGreaterThanOrEqual(res.body[1].amount)
        })

    })
})
