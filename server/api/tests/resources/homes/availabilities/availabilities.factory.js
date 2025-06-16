import mongoose from 'mongoose'
import { faker } from '@faker-js/faker'

export const createAvailability = async (overrides = {}) => {
    const Availability = global.__TEST_STATE__.dbClient.model('Availability')
    const num_days = overrides?.num_days ?? faker.number.int({ min: 2, max: 10 })
    const startDate = faker.date.soon()
    const startDateEpoch = Math.round(startDate.getTime() / (86400 * 1000))
    const returnValue = []
    for (let i = 0; i < num_days; i++) {
        const defaultAvailability = {
            epochDate: startDateEpoch + i, // 2023-01-01T00:00:00.000Z
            homeId: new mongoose.Types.ObjectId(), // can override this
            ...overrides
        }
        const availability = new Availability(defaultAvailability)
        returnValue.push(await availability.save())
    }
    return returnValue
}