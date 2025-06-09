import { faker } from '@faker-js/faker'

export const createBooking = async (overrides = {}) => {
    const Booking = global.__TEST_STATE__.dbClient.model('Booking')

    const startDate = faker.date.soon()
    const startEpoch = Math.round(startDate.getTime() / (86400 * 1000))
    const days = faker.number.int({ min: 1, max: 5 })

    const defaultBooking = {
        startEpoch,
        endEpoch: startEpoch + days,
        guestCount: 2,
        totalAmount: 960,
        status: 'confirmed',
        ...overrides
    }
    const booking = new Booking(defaultBooking)
    return await booking.save()
}