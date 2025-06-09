import mongoose from 'mongoose'
import sharp from 'sharp'
import validator from 'validator'
import { getOrCreateModel } from '../../utils/getModel'

export default (dbClient) => {

    const imageSchema = new mongoose.Schema({
        imageData: {
            type: String,
        },
        url: {
            type: String,
            trim: true,
            validate: {
                validator: function (v) {
                    return validator.isURL(v, { protocols: ['http', 'https'] })
                },
                message: props => `${props.value} is not a valid URL`
            }
        },
        tags: [{
            tag: {
                type: String,
                required: true
            }
        }],
        description: {
            type: String,
            default: ''
        }
    }, {
        timestamps: true
    })

    imageSchema.pre('validate', function (next) {
        const image = this
        if (!image.imageData && !image.url) {
            throw new Error('imageData or URL is required')
        }

        if (image.imageData && image.url) {
            throw new Error('Both imageData and URL cannot be specified')
        }
        next()
    })

    imageSchema.statics.getModifiedImage = async function (imageData, options) {
        const buffer = Buffer.from(imageData.split(',')[1], 'base64')
        const resultBuffer = await sharp(buffer).resize(options).jpeg().toBuffer()
        return resultBuffer
    }

    imageSchema.statics.downloadImage = async function (url) {
        const imageBlob = await (await fetch(url, {
            headers: {},
        })).blob()

        const imageArrayBuffer = await imageBlob.arrayBuffer();
        const resultBuffer = Buffer.from(imageArrayBuffer);

        const result = `data:${imageBlob.type};base64,$${resultBuffer.toString('base64')}`
        return result
    }

    const Image = getOrCreateModel(dbClient, 'Image', imageSchema)
    return Image
}
