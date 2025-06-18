import { jest } from '@jest/globals'

// Mock BEFORE anything else
jest.unstable_mockModule('google-auth-library', () => ({
    OAuth2Client: jest.fn().mockImplementation(() => ({
        verifyIdToken: jest.fn().mockImplementation(({ idToken }) => {
            if (idToken === 'fail-token') {
                return Promise.reject(new Error('Invalid token'))
            }
            return Promise.resolve({
                getPayload: () => ({
                    email: 'googleuser@example.com',
                    name: 'Google User',
                    picture: 'https://example.com/photo.jpg'
                })
            })
        })
    }))
}))

jest.unstable_mockModule('axios', () => {
    return {
        default: {
            post: jest.fn(async () => {
                const paymentMock = global.__MOCK_CONFIG__?.payments

                if (paymentMock?.createOrderShouldThrowException) {
                    throw new Error("Mock Exception")
                }

                if (paymentMock?.createOrderShouldFail) {
                    return { status: 400 }
                }

                return {
                    status: 201,
                    data: {
                        id: "TEST_PAYMENT_ID",
                        status: "Pending",
                        gatewayRefs: {
                            gatewayRefOrderId: "order_123"
                        }
                    }
                }
            })
        },
        __esModule: true
    }
})

// Import and expose createApp only after mocking is in place
const mod = await import('./_createApp.js')
export default mod.default