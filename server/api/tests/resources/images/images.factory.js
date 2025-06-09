import sharp from 'sharp'
import { faker } from '@faker-js/faker'

export const generateFakeImageUrl = () => {
    // Returns a valid HTTP image URL
    return faker.image.url() // or faker.image.urlPicsumPhotos() for variety
}

export const generateBase64Jpeg = async () => {
    const buffer = await sharp({
        create: {
            width: 100,
            height: 100,
            channels: 3,
            background: { r: 220, g: 220, b: 220 }
        }
    }).jpeg().toBuffer()

    return `data:image/jpeg;base64,${buffer.toString('base64')}`
}

export const createImage = async (overrides = {}) => {
    const Image = global.__TEST_STATE__.dbClient.model('Image')

    const defaultImage = {
        imageData: await generateBase64Jpeg(),
        tags: [],
        description: '',
        ...overrides
    }

    const image = new Image(defaultImage)
    await image.save()
    return image
}