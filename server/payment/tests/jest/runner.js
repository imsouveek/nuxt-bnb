import { jest } from '@jest/globals'
import { randomUUID } from 'crypto'

jest.unstable_mockModule('razorpay', () => ({
    default: jest.fn().mockImplementation(() => ({
        orders: {
            create: jest.fn().mockImplementation(async (input) => {
                if (global.__MOCK_CONFIG__?.Razorpay?.createOrderShouldFail) {
                    throw new Error('Simulated Razorpay order creation failure')
                }

                return {
                    id: `order_${randomUUID()}`,
                    receipt: input.receipt || 'default_receipt',
                    amount: input.amount,
                    currency: input.currency || 'INR',
                    status: 'created'
                }
            })
        },
        payments: {
            fetch: jest.fn().mockImplementation(async (paymentId) => {
                if (global.__MOCK_CONFIG__?.Razorpay?.fetchPaymentStatusShouldFail) {
                    return { id: paymentId, status: 'failed' }
                }

                return {
                    id: paymentId,
                    status: 'captured', // simulate successful payment
                    method: 'card',
                    amount: 1000,
                    currency: 'INR'
                }
            })
        }
    }))
}))


jest.unstable_mockModule('axios', () => {
    return {
        default: {
            patch: jest.fn(async () => {
                if (global.__MOCK_CONFIG__?.bookingApi.updateShouldThrowError) {
                    throw new Error("Mock Booking API Error")
                }
                return
            })
        },
        __esModule: true
    }
})

const mod = await import('./_createApp.js')
export default mod.default