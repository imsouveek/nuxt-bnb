import mongoose from 'mongoose'
import validator from 'validator'
import { getOrCreateModel } from '../../../utils/getModel.js'

export default (dbClient) => {
    const reviewSchema = new mongoose.Schema({
        rating: {
            type: Number,
            required: true
        },
        reviewer: {
            image: {
                type: String,
                trim: true,
                validate: {
                    validator: function (v) {
                        return validator.isURL(v, {
                            protocols: ['http', 'https']
                        })
                    },
                    message: props => `${props.value} is not a valid URL`
                }
            },
            name: {
                type: String,
                required: true,
                trim: true
            }
        },
        comment: {
            type: String,
            required: true,
            trim: true
        },
        homeId: {
            type: mongoose.Schema.Types.ObjectID,
            required: true,
            ref: 'Home'
        }
    }, {
        timestamps: true
    })

    const Review = getOrCreateModel(dbClient, 'Review', reviewSchema)
    return Review
}
