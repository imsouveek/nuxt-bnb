import { jest } from '@jest/globals'
import { randomUUID } from 'crypto'

jest.unstable_mockModule('razorpay', () => ({
    default: jest.fn().mockImplementation(() => ({
        orders: {
            create: jest.fn().mockImplementation(async (input) => ({
                id: `order_${randomUUID()}`,
                receipt: input.receipt || 'default_receipt',
                amount: input.amount,
                currency: input.currency || 'INR',
                status: 'created'
            }))
        }
    }))
}))

const mod = await import('./_createApp.js')
export default mod.default