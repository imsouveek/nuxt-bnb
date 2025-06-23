import { createUser } from '../users/users.factory.js'
import { createHome } from '../homes/homes.factory.js'
import { createAvailability } from '../homes/availabilities/availabilities.factory.js'
import { createReview } from '../homes/reviews/reviews.factory.js'
import { createBooking } from '../bookings/bookings.factory.js'
import { loginUser } from '../../utils/headerHelpers.js'

export const setupSearchFixtures = async () => {
    const user = await createUser({ email: 'search@example.com', password: 'pass123' })
    const login = await loginUser(global.__TEST_STATE__.app, user.email, 'pass123')
    const authHeader = login.authHeader()

    const homes = await Promise.all([
        createHome({ owner: user._id, _geoloc: { lat: 12.9, lng: 77.6 } }),       // Home 0
        createHome({ owner: user._id, _geoloc: { lat: 12.95, lng: 77.65 } }),     // Home 1 (with availability & review)
        createHome({ owner: user._id, _geoloc: { lat: 13.5, lng: 78.1 } }),       // Home 2 (outside radius)
        createHome({ owner: user._id, _geoloc: { lat: 12.91, lng: 77.61 } }),     // Home 3 (booked: pending)
        createHome({ owner: user._id, _geoloc: { lat: 12.92, lng: 77.62 } })      // Home 4 (booked: cancelled)
    ])

    const availabilities = await createAvailability({ homeId: homes[1]._id })
    const reviews = await createReview({ homeId: homes[1]._id })

    const booking = await createBooking({
        home: homes[3]._id,
        user: user._id,
        startEpoch: 20000,
        endEpoch: 20003,
        status: 'Pending'
    })

    const cancelledBooking = await createBooking({
        home: homes[4]._id,
        user: user._id,
        startEpoch: 20000,
        endEpoch: 20003,
        status: 'Failed'
    })

    return {
        user,
        authHeader,
        homes,
        availabilities,
        reviews,
        booking,
        cancelledBooking
    }
}
