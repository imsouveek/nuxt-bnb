import mongoose from 'mongoose'
import { faker } from '@faker-js/faker'

export const createHome = async (overrides = {}) => {
    // Assuming the Home model is already registered
    const Home = global.__TEST_STATE__.dbClient.model('Home')
    const defaultHome = {
        title: faker.lorem.words(3),
        description: faker.lorem.paragraph(),
        note: faker.lorem.sentence(),
        pricePerNight: faker.number.int({ min: 50, max: 500 }),
        type: faker.helpers.arrayElement(['APARTMENT', 'HOUSE', 'VILLA']),
        reviewCount: faker.number.int({ min: 0, max: 50 }),
        reviewValue: faker.number.float({ min: 0, max: 5, precision: 0.1 }),
        features: faker.helpers.arrayElements(
            ['wifi', 'kitchen', 'pool', 'parking', 'heating', 'ac'],
            { min: 2, max: 4 }
        ),
        location: {
            address: faker.location.streetAddress(),
            city: faker.location.city().toUpperCase(),
            state: faker.location.state().toUpperCase(),
            postalCode: faker.location.zipCode().toUpperCase(),
            country: faker.location.country().toUpperCase()
        },
        guests: faker.number.int({ min: 1, max: 10 }),
        bedrooms: faker.number.int({ min: 1, max: 5 }),
        beds: faker.number.int({ min: 1, max: 5 }),
        bathrooms: faker.number.int({ min: 1, max: 3 }),
        images: [],
        _geoloc: {
            lat: parseFloat(faker.location.latitude()),
            lng: parseFloat(faker.location.longitude())
        },
        owner: new mongoose.Types.ObjectId(), // can override this
        ...overrides
    }

    const home = new Home(defaultHome)
    await home.save()
    return home
}
