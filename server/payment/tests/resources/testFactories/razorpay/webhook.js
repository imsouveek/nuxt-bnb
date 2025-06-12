import { faker } from '@faker-js/faker'
import crypto from 'crypto'

export default () => {
    const createWebhook = (secret, overrides = {}) => {
        const { order, orderId, eventId = faker.string.uuid(), status = 'Success', signature } = overrides
        const resolvedOrderId =
            order?.gateway?.razorpay?.razorpayOrderId ||
            orderId ||
            faker.string.uuid()

        const paymentId = faker.string.alpha(10)

        const body = {
            entity: 'event',
            event: status === 'Success' ? 'payment.captured' : 'payment.failed',
            contains: ['payment'],
            payload: {
                payment: {
                    entity: {
                        id: paymentId,
                        entity: 'payment',
                        amount: Math.round(order?.amount * 100) || 10000,
                        currency: 'INR',
                        status: status === 'Success' ? 'captured' : 'failed',
                        order_id: resolvedOrderId,
                        method: 'netbanking',
                        email: faker.internet.email(),
                        contact: faker.phone.number({ style: 'international' }),
                    }
                }
            }
        }

        const rawBody = JSON.stringify(body)
        const headerSignature = signature ?? crypto
            .createHmac('sha256', secret)
            .update(rawBody)
            .digest('hex')

        return {
            rawBody,
            headers: {
                'x-razorpay-signature': headerSignature,
                'x-razorpay-event-id': eventId,
                'content-type': 'application/json'
            },
            extracted: {
                eventId,
                orderId: resolvedOrderId,
                paymentId
            }
        }
    }

    const createClientRequest = (secret, overrides = {}) => {
        const { order, orderId, signature } = overrides
        const razorpay_order_id =
            order?.gateway?.razorpay?.razorpayOrderId ||
            orderId ||
            faker.string.uuid()
        const razorpay_payment_id = faker.string.uuid()
        const razorpay_signature = signature ?? crypto
            .createHmac('sha256', secret)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex')

        return {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        }
    }

    const verifyWebhookResult = ({ rawBody, headers, orderInDb }) => {
        const entity = JSON.parse(rawBody).payload.payment.entity

        expect(orderInDb.gateway?.razorpay?.razorpayPaymentId)
            .toBe(entity.id)

        expect(orderInDb.gateway?.razorpay?.razorpaySignature)
            .toBe(headers['x-razorpay-signature'])
    }

    const verifyClientResult = ({ rawBody, orderInDb }) => {
        expect(orderInDb.gateway?.razorpay?.razorpayPaymentId)
            .toBe(rawBody.razorpay_payment_id)
    }

    return {
        createWebhook,
        createClientRequest,
        verifyWebhookResult,
        verifyClientResult
    }
}