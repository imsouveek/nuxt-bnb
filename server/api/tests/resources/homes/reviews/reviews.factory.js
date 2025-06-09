import mongoose from 'mongoose'
import { faker } from '@faker-js/faker'

export const createReview = async (overrides = {}) => {
    const Review = global.__TEST_STATE__.dbClient.model('Review')
    const num_reviews = faker.number.int({ min: 1, max: 10 })
    const returnValue = []
    for (let i = 0; i < num_reviews; i++) {
        const defaultReview = {
            rating: faker.number.int({ min: 1, max: 5 }),
            reviewer: {
                image: faker.image.avatar(),
                name: faker.person.fullName()
            },
            comment: faker.lorem.paragraph(),
            homeId: new mongoose.Types.ObjectId(), // can override this
            ...overrides
        }
        const review = new Review(defaultReview)
        returnValue.push(await review.save())
    }
    return returnValue
}