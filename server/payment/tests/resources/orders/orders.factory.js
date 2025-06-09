import { faker } from '@faker-js/faker'

export const createOrder = async (gatewayType = '', overrides = {}) => {
    const Order = globalThis.__TEST_STATE__.dbClient.order

    let gatewayInclude = {}
    switch (gatewayType) {
        case 'Razorpay':
            gatewayInclude = await razorpay()
            break;
    }

    return await Order.create({
        data: {
            bookingId: faker.database.mongodbObjectId(),
            amount: parseFloat(faker.finance.amount()),
            status: ['New', 'Pending', 'Success', 'Failed'][faker.number.int({
                min: 0,
                max: 3
            })],
            ...gatewayInclude,
            ...overrides
        }
    })

}

const razorpay = async () => {
    return {
        gateway: {
            create: {
                type: 'Razorpay',
                razorpay: {
                    create: {
                        razorpayOrderId: faker.string.alphanumeric(15),
                        razorpayPaymentId: faker.string.alphanumeric(15),
                        razorpaySignature: faker.string.alphanumeric(15)
                    }
                }
            }
        }
    }
}