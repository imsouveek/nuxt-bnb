import request from 'supertest'
import { setupSearchFixtures } from './fixtures.js'

describe('GET /api/search/homes - Location and Availability filters', () => {
    let homes, availabilities

    beforeEach(async () => {
        const setup = await setupSearchFixtures()
        homes = setup.homes
        availabilities = setup.availabilities
    })

    it('returns all homes when no filters are applied', async () => {
        const res = await request(global.__TEST_STATE__.app)
            .get('/api/search/homes')

        expect(res.statusCode).toBe(200)
        expect(res.body.length).toBe(5)
    })

    it('returns homes near a given lat/lng within radius', async () => {
        const res = await request(global.__TEST_STATE__.app)
            .get('/api/search/homes')
            .query({ lat: 12.9, lng: 77.6, radius: 8000 })

        expect(res.statusCode).toBe(200)
        const ids = res.body.map(h => h._id)
        expect(ids).toContain(homes[0]._id.toString())
        expect(ids).toContain(homes[1]._id.toString())
        expect(ids).not.toContain(homes[2]._id.toString())
    })

    it('filters out unavailable homes for a date range', async () => {
        const epoch = availabilities[0].epochDate
        const res = await request(global.__TEST_STATE__.app)
            .get('/api/search/homes')
            .query({
                startEpoch: epoch,
                endEpoch: epoch + 1
            })

        expect(res.statusCode).toBe(200)
        const ids = res.body.map(h => h._id)
        expect(ids).not.toContain(homes[1]._id.toString()) // this one has availability
    })

    it('returns all homes if no availability overlap is found', async () => {
        const res = await request(global.__TEST_STATE__.app)
            .get('/api/search/homes')
            .query({
                startEpoch: 99999,
                endEpoch: 100000
            })

        expect(res.statusCode).toBe(200)
        expect(res.body.length).toBe(5) // none overlap that far out
    })

    it('returns 500 if startEpoch > endEpoch', async () => {
        const res = await request(global.__TEST_STATE__.app)
            .get('/api/search/homes')
            .query({
                startEpoch: 300,
                endEpoch: 100
            })

        expect(res.statusCode).toBe(500)
    })

    it('returns 500 for invalid lat/lng input', async () => {
        const res = await request(global.__TEST_STATE__.app)
            .get('/api/search/homes')
            .query({ lat: 'foo', lng: 'bar', radius: 5000 })

        expect(res.statusCode).toBe(500)
    })

    it('excludes homes with overlapping confirmed/pending bookings, but not cancelled ones, when excludeBooked=true', async () => {
        const res = await request(global.__TEST_STATE__.app)
            .get('/api/search/homes?excludeBooked=true&startEpoch=20001&endEpoch=20002')

        expect(res.statusCode).toBe(200)
        expect(res.body.length).toBe(4)

        const ids = res.body.map(h => h._id)
        expect(ids).not.toContain(homes[3]._id.toString()) // has pending booking
        expect(ids).toContain(homes[4]._id.toString())     // has cancelled booking
    })
})
