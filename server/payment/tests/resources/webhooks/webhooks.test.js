import request from 'supertest'
import webhooksFactory from './webhooks.factory.js'
import dbModule from '../../../strategies/db.js'
import create from '../orders/orders.factory.js'

const { createOrder } = create()

let app, db, config, createdOrder
const gatewayNames = ['Razorpay']

async function getOrderInDb(createdOrder, gatewayDbModel) {
    return await db.order.findUnique({
        where: {
            id: createdOrder.id
        },
        include: {
            gateway: {
                include: gatewayDbModel.select()
            }
        }
    })
}

beforeAll(async () => {
    app = global.__TEST_STATE__.app
    db = global.__TEST_STATE__.dbClient
    config = global.__TEST_STATE__.config
})

describe('Webhooks API', () => {
    it('fails for invalid gateway', async () => {
        await request(app)
            .post('/payment/webhooks/abcd')
            .send({})
            .expect(500)
    })

    it('fails for invalid gateway (client)', async () => {
        await request(app)
            .post('/payment/webhooks/abcd/client')
            .send({})
            .expect(500)
    })

    for (const gatewayName of gatewayNames) { // Use 'of' for iterating array elements
        const gateway = gatewayName.toLowerCase()

        let gatewayFactory, webhook_secret, key_secret, gatewayDbModel
        beforeAll(() => {
            gatewayFactory = (webhooksFactory())[gateway]
            gatewayDbModel = dbModule(gateway)
            webhook_secret = config[gateway]?.webhook_secret
            key_secret = config[gateway]?.key_secret
            if (!webhook_secret || !key_secret) throw new Error(`Missing secrets for ${gateway}`)
        })

        beforeEach(async () => {
            createdOrder = await createOrder(gatewayName)
            global.__MOCK_CONFIG__[gatewayName] = { fetchPaymentStatusShouldFail: false }
        })

        describe(`/payment/webhooks/${gateway}`, () => {

            it(`should successfully process a valid ${gateway} payment.captured webhook`, async () => {
                const { rawBody, headers, extracted } = gatewayFactory.createWebhook(webhook_secret, {
                    order: createdOrder
                })

                // Use the correct gateway in the URL path
                const res = await request(app)
                    .post(`/payment/webhooks/${gateway}`) // Use template literal for gateway
                    .set(headers) // Use .set() for headers with Supertest
                    .send(rawBody)

                expect(res.statusCode).toBe(200)

                const updatedOrder = await getOrderInDb(createdOrder, gatewayDbModel)

                expect(updatedOrder).toBeDefined()
                expect(updatedOrder.status).toBe('Success');
                gatewayFactory.verifyWebhookResult({
                    rawBody,
                    headers,
                    orderInDb: updatedOrder
                })
                console.log(extracted.eventId)
                const webhookInDb = await db.webhookEvent.findUnique({
                    where: {
                        eventId: extracted.eventId
                    }
                })
                expect(webhookInDb.gatewayId).toBe(extracted.gatewayId)
            })

            // Add test for payment.failed
            it(`should correctly process a ${gateway} payment.failed webhook`, async () => {
                const { rawBody, headers, extracted } = gatewayFactory.createWebhook(webhook_secret, {
                    order: createdOrder,
                    status: 'Failed'
                })

                const res = await request(app)
                    .post(`/payment/webhooks/${gateway}`)
                    .set(headers)
                    .send(rawBody)

                expect(res.statusCode).toBe(200);

                const updatedOrder = await getOrderInDb(createdOrder, gatewayDbModel)

                expect(updatedOrder).toBeDefined();
                expect(updatedOrder.status).toBe('Failed');
                gatewayFactory.verifyWebhookResult({
                    rawBody,
                    headers,
                    orderInDb: updatedOrder
                })

                console.log(extracted.eventId)
                const webhookInDb = await db.webhookEvent.findUnique({
                    where: {
                        eventId: extracted.eventId
                    }
                })
                expect(webhookInDb.gatewayId).toBe(extracted.gatewayId)
            })

            it(`should correctly fail a ${gateway} webhook if verification against gateway fails`, async () => {
                global.__MOCK_CONFIG__[gatewayName] = { fetchPaymentStatusShouldFail: true }
                const { rawBody, headers, extracted } = gatewayFactory.createWebhook(webhook_secret, {
                    order: createdOrder
                })
                const res = await request(app)
                    .post(`/payment/webhooks/${gateway}`)
                    .set(headers)
                    .send(rawBody)

                expect(res.statusCode).toBe(500);

                const webhookInDb = await db.webhookEvent.findUnique({
                    where: {
                        eventId: extracted.eventId
                    }
                })
                expect(webhookInDb).toBeNull()
            })

            it(`should correctly process a ${gateway} webhook with mismatched order`, async () => {
                const { rawBody, headers, extracted } = gatewayFactory.createWebhook(webhook_secret)
                const res = await request(app)
                    .post(`/payment/webhooks/${gateway}`)
                    .set(headers)
                    .send(rawBody)

                expect(res.statusCode).toBe(200);

                console.log(extracted.eventId)
                const webhookInDb = await db.webhookEvent.findUnique({
                    where: {
                        eventId: extracted.eventId
                    }
                })
                expect(webhookInDb.gatewayId).toBe('')
            })

            it(`should return 500 for ${gateway} webhook with invalid signature`, async () => {
                const { rawBody, headers, extracted } = gatewayFactory.createWebhook(webhook_secret, {
                    signature: 'invalid-signature-123'
                })

                const res = await request(app)
                    .post(`/payment/webhooks/${gateway}`)
                    .set(headers)
                    .send(rawBody)

                expect(res.statusCode).toBe(500)

                const webhookInDb = await db.webhookEvent.findUnique({
                    where: {
                        eventId: extracted.eventId
                    }
                })
                expect(webhookInDb).toBeNull()
            })

            it(`should return 500 for ${gateway} webhook with missing signature`, async () => {
                const { rawBody, headers } = gatewayFactory.createWebhook(webhook_secret)

                for (const key of Object.keys(headers)) {
                    const testHeaders = { ...headers }
                    delete testHeaders[key]

                    const res = await request(app)
                        .post(`/payment/webhooks/${gateway}`)
                        .set(testHeaders)
                        .send(rawBody)

                    expect(res.statusCode).toBe(500)
                }
            })

            it(`should only process a ${gateway} webhook once if event-id is duplicated`, async () => {
                const eventId = 'test-idempotent-event'
                const firstWebhook = gatewayFactory.createWebhook(webhook_secret, {
                    order: createdOrder,
                    eventId,
                    status: 'Failed'
                })

                // First call: should process normally
                await request(app)
                    .post(`/payment/webhooks/${gateway}`)
                    .set(firstWebhook.headers)
                    .send(firstWebhook.rawBody)
                    .expect(200)

                // Assuming your service changes status to 'Success' on first capture
                await new Promise(resolve => setTimeout(resolve, 50)) // Small delay for DB write

                const orderAfterFirstCall = await getOrderInDb(createdOrder, gatewayDbModel)

                expect(orderAfterFirstCall).toBeDefined();
                expect(orderAfterFirstCall.status).toBe('Failed');

                // Second call with same event ID: should be skipped/not change status again
                const secondWebhook = gatewayFactory.createWebhook(webhook_secret, {
                    order: createdOrder,
                    eventId, // Same event ID
                    status: 'Success'
                })

                await request(app)
                    .post(`/payment/webhooks/${gateway}`)
                    .set(secondWebhook.headers)
                    .send(secondWebhook.rawBody)
                    .expect(200)

                const orderAfterSecondCall = await getOrderInDb(createdOrder, gatewayDbModel)
                expect(orderAfterSecondCall.status).toBe('Failed');
            })
        })

        // --- Client-side verification tests ---
        describe(`/payment/webhooks/${gateway}/client`, () => {

            it(`should successfully verify a valid ${gateway} client request`, async () => {
                const payload = gatewayFactory.createClientRequest(key_secret, {
                    order: createdOrder
                })

                await request(app)
                    .post(`/payment/webhooks/${gateway}/client`)
                    .send(payload)
                    .expect(200)

                const updatedOrder = await getOrderInDb(createdOrder, gatewayDbModel)

                expect(updatedOrder).toBeDefined()
                expect(updatedOrder.status).toBe('Success');
                gatewayFactory.verifyClientResult({
                    rawBody: payload,
                    orderInDb: updatedOrder
                })
            });

            it(`should correctly fail a ${gateway} client if verification fails against gateway`, async () => {
                global.__MOCK_CONFIG__[gatewayName] = { fetchPaymentStatusShouldFail: true }
                const payload = gatewayFactory.createClientRequest(key_secret, {
                    order: createdOrder
                })

                await request(app)
                    .post(`/payment/webhooks/${gateway}/client`)
                    .send(payload)
                    .expect(500)
            })

            it(`should fail to verify an invalid ${gateway} client request`, async () => {
                const payload = gatewayFactory.createClientRequest(key_secret, {
                    order: createdOrder,
                    signature: 'invalid_signature_here'
                })

                await request(app)
                    .post(`/payment/webhooks/${gateway}/client`)
                    .send(payload)
                    .expect(500);

            })
        })
    }
})