import request from 'supertest'
import { createUser } from '../../users/users.factory.js'
import { createHome } from '../homes.factory.js'
import { loginUser } from '../../../utils/headerHelpers.js'
import { createReview } from './reviews.factory.js'

describe('Review API', () => {
    let authUser, authHeader, otherUser, otherHeader, home, review

    beforeEach(async () => {
        authUser = await createUser({ email: 'owner@example.com', password: 'password123' })
        otherUser = await createUser({ email: 'intruder@example.com', password: 'password123' })

        const login1 = await loginUser(global.__TEST_STATE__.app, authUser.email, 'password123')
        const login2 = await loginUser(global.__TEST_STATE__.app, otherUser.email, 'password123')

        authHeader = login1.authHeader()
        otherHeader = login2.authHeader()

        home = await createHome({ owner: authUser._id })
        review = await createReview({ homeId: home._id })
    })

    describe('GET /api/homes/:homeId/reviews', () => {
        it('returns reviews for a specific home', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .get(`/api/homes/${home._id}/reviews`)
                .set(authHeader)

            expect(res.statusCode).toBe(200)
            expect(Array.isArray(res.body)).toBe(true)
            expect(res.body.length).toBe(review.length)
            expect(res.body[0].homeId.toString()).toBe(home._id.toString())
        })

        it('fails to retrieve reviews non-existent home', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .get('/api/homes/123456789012345678901234/reviews')
                .set(authHeader)

            expect(res.statusCode).toBe(500)
        })

        it('fails to retrieve reviews for unauthenticated user', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .get(`/api/homes/${home._id}/reviews`)

            expect(res.statusCode).toBe(401)
        })

        it('fails to retrieve reviews for unauthorized user', async () => {
            const res = await request(global.__TEST_STATE__.app)
                .get(`/api/homes/${home._id}/reviews`)
                .set(otherHeader)

            expect(res.statusCode).toBe(500)
        })
    })
})
