import { faker } from '@faker-js/faker'

export default () => {
    const createOrder = (overrides) => {
        const razorpayOverrides = overrides?.gateway?.razorpay ?? {}
        return {
            razorpay: {
                create: {
                    razorpayOrderId: razorpayOverrides.razorpayOrderId ?? faker.string.alphanumeric(15),
                    razorpayPaymentId: razorpayOverrides.razorpayPaymentId ?? faker.string.alphanumeric(15),
                    razorpaySignature: razorpayOverrides.razorpaySignature ?? faker.string.alphanumeric(15)
                }
            }
        }
    }

    const verifyOrder = async ({ responseBody, payload, status }) => {
        const dbClient = global.__TEST_STATE__.dbClient

        const orderInDb = await dbClient.order.findUnique({
            where: { bookingId: payload.bookingId },
            include: {
                gateway: { include: { razorpay: true } }
            }
        })

        expect(orderInDb).not.toBeNull()
        expect(orderInDb.bookingId).toBe(payload.bookingId)
        expect(orderInDb.amount).toBe(payload.amount)
        expect(orderInDb.status).toBe(responseBody.status)
        expect(orderInDb.gateway?.type).toBe('Razorpay')
        expect(orderInDb.gateway?.razorpay?.razorpayOrderId).toEqual(responseBody.gatewayRefs.gatewayRefOrderId)

        expect(responseBody).toMatchObject({
            bookingId: payload.bookingId,
            amount: payload.amount,
            status,
            gatewayType: 'Razorpay',
            gatewayRefs: {
                gatewayRefOrderId: expect.any(String)
            }
        })
    }

    return {
        createOrder,
        verifyOrder
    }
}
