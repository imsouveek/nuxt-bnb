import { faker } from '@faker-js/faker'
import dbModule from '../../../strategies/db.js'
import razorpayFactory from '../testFactories/razorpay/order.js'

export default () => {
    const gatewayFactories = {
        razorpay: razorpayFactory()
    }

    const createOrder = async (gatewayType = '', overrides = {}) => {
        const Order = globalThis.__TEST_STATE__.dbClient.order
        const gatewayKey = gatewayType.toLocaleLowerCase()
        const gatewayFactory = gatewayFactories[gatewayKey]
        const gatewayDbModel = gatewayFactory ? dbModule(gatewayKey) : null

        const query = {
            data: {
                bookingId: overrides.bookingId ?? faker.database.mongodbObjectId(),
                amount: overrides.amount ?? parseFloat(faker.finance.amount()),
                status: overrides.status ?? ['New', 'Pending', 'Success', 'Failed'][faker.number.int({
                    min: 0,
                    max: 3
                })],
                createdAt: overrides.createdAt ?? new Date(Date.now())
            }
        }
        if (gatewayFactory) {
            query.data.gateway = {
                create: {
                    type: gatewayType,
                    ...gatewayFactory.createOrder(overrides)
                }
            }
            query.include = {
                gateway: {
                    include: gatewayDbModel.select()
                }
            }
        }
        return await Order.create(query)
    }

    const verifyOrder = async (gatewayType, { responseBody, payload, status }) => {
        const gatewayKey = gatewayType.toLocaleLowerCase()
        const gatewayFactory = gatewayFactories[gatewayKey]

        return await gatewayFactory.verifyOrder({ responseBody, payload, status })
    }

    return {
        createOrder,
        verifyOrder
    }
}
