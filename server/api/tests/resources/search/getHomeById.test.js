import request from 'supertest'
import { setupSearchFixtures } from './fixtures.js'

describe('GET /api/search/homes/:id and related paths', () => {
    let homes, home

    beforeEach(async () => {
        const setup = await setupSearchFixtures()
        homes = setup.homes
        home = homes[1] // the one with availability and reviews
    })

    it('returns a home by ID', async () => {
        const res = await request(global.__TEST_STATE__.app)
            .get(`/api/search/homes/${home._id}`)

        expect(res.statusCode).toBe(200)
        expect(res.body._id.toString()).toBe(home._id.toString())
        expect(res.body._geoloc).toHaveProperty('lat')
        expect(res.body._geoloc).toHaveProperty('lng')
    })

    it('returns multiple homes by IDs', async () => {
        const res = await request(global.__TEST_STATE__.app)
            .get(`/api/search/homes?homeId=${homes[0]._id}&homeId=${homes[1]._id}`)

        expect(res.statusCode).toBe(200)
        expect(res.body.length).toBe(2)
        expect(res.body[0]._id.toString()).toBe(homes[0]._id.toString())
        expect(res.body[1]._id.toString()).toBe(homes[1]._id.toString())
    })

    it('returns 404 for non-existent home', async () => {
        const res = await request(global.__TEST_STATE__.app)
            .get('/api/search/homes/123456789012345678901234')

        expect(res.statusCode).toBe(404)
    })

    it('returns 500 for invalid home Id', async () => {
        const res = await request(global.__TEST_STATE__.app)
            .get('/api/search/homes/asdfg')

        expect(res.statusCode).toBe(500)
    })

    it('returns the populated owner of a home', async () => {
        const res = await request(global.__TEST_STATE__.app)
            .get(`/api/search/homes/${home._id}/owner`)

        expect(res.statusCode).toBe(200)
        expect(res.body).toHaveProperty('_id')
        expect(res.body).toHaveProperty('email')
    })

    it('returns 404 for owner of non-existent home', async () => {
        const res = await request(global.__TEST_STATE__.app)
            .get('/api/search/homes/123456789012345678901234/owner')

        expect(res.statusCode).toBe(404)
    })

    it('returns 500 for owner of home with invalid homeId as input', async () => {
        const res = await request(global.__TEST_STATE__.app)
            .get('/api/search/homes/asdfg/owner')

        expect(res.statusCode).toBe(500)
    })

    it('returns the availabilities of a home', async () => {
        const res = await request(global.__TEST_STATE__.app)
            .get(`/api/search/homes/${home._id}/availabilities`)

        expect(res.statusCode).toBe(200)
        expect(Array.isArray(res.body)).toBe(true)
        expect(res.body[0]).toHaveProperty('epochDate')
    })

    it('returns 404 for availabilities of non-existent home', async () => {
        const res = await request(global.__TEST_STATE__.app)
            .get('/api/search/homes/123456789012345678901234/availabilities')

        expect(res.statusCode).toBe(404)
    })

    it('returns the reviews of a home', async () => {
        const res = await request(global.__TEST_STATE__.app)
            .get(`/api/search/homes/${home._id}/reviews`)

        expect(res.statusCode).toBe(200)
        expect(Array.isArray(res.body)).toBe(true)
        expect(res.body[0]).toHaveProperty('rating')
        expect(res.body[0]).toHaveProperty('comment')
    })

    it('returns 404 for reviews of non-existent home', async () => {
        const res = await request(global.__TEST_STATE__.app)
            .get('/api/search/homes/123456789012345678901234/reviews')

        expect(res.statusCode).toBe(404)
    })
})
