import request from 'supertest'
import { setupSearchFixtures } from './fixtures.js'

describe('Query Parameters (limit, skip, fieldList)', () => {
    beforeEach(async () => {
        await setupSearchFixtures()
    })

    it('respects limit parameter', async () => {
        const res = await request(global.__TEST_STATE__.app)
            .get('/api/search/homes')
            .query({ limit: 2 })

        expect(res.statusCode).toBe(200)
        expect(res.body.length).toBe(2)
    })

    it('respects skip parameter', async () => {
        const res1 = await request(global.__TEST_STATE__.app)
            .get('/api/search/homes')
            .query({ limit: 1 })

        const res2 = await request(global.__TEST_STATE__.app)
            .get('/api/search/homes')
            .query({ limit: 1, skip: 1 })

        expect(res1.statusCode).toBe(200)
        expect(res2.statusCode).toBe(200)
        expect(res1.body[0]._id).not.toBe(res2.body[0]._id)
    })

    it('respects fieldList parameter', async () => {
        const res = await request(global.__TEST_STATE__.app)
            .get('/api/search/homes')
            .query({ fieldList: 'title,_id' })

        expect(res.statusCode).toBe(200)
        const home = res.body[0]
        expect(home).toHaveProperty('title')
        expect(home).toHaveProperty('_id')
        expect(home).not.toHaveProperty('description')
        expect(home).not.toHaveProperty('owner')
        expect(home).not.toHaveProperty('_geoloc')
    })

    it('respects sortBy parameter', async () => {
        const resAsc = await request(global.__TEST_STATE__.app)
            .get('/api/search/homes')
            .query({ sortBy: 'pricePerNight_asc' })

        const resDesc = await request(global.__TEST_STATE__.app)
            .get('/api/search/homes')
            .query({ sortBy: 'pricePerNight_desc' })

        expect(resAsc.statusCode).toBe(200)
        expect(resDesc.statusCode).toBe(200)

        // Check sorting by comparing first two results
        if (resAsc.body.length >= 2 && resDesc.body.length >= 2) {
            expect(resAsc.body[0].pricePerNight).toBeLessThanOrEqual(resAsc.body[1].pricePerNight)
            expect(resDesc.body[0].pricePerNight).toBeGreaterThanOrEqual(resDesc.body[1].pricePerNight)
        }
    })
})