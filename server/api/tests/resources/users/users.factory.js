import { faker } from '@faker-js/faker'

export const createUser = async (overrides = {}) => {
    const User = global.__TEST_STATE__.dbClient.model('User')
    const passwordPlain = overrides.password || 'defaultPassword123'

    const newUser = new User({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: passwordPlain,
        authStrategy: 'local',
        ...overrides
    })

    await newUser.save()
    return newUser
}