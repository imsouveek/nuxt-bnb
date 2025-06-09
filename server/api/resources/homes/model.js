import mongoose from 'mongoose'
import { getOrCreateModel } from '../../utils/getModel.js'

export default (dbClient) => {
    const homeSchema = new mongoose.Schema({
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        note: {
            type: String,
            trim: true
        },
        pricePerNight: {
            type: Number,
            trim: true,
            required: true
        },
        type: {
            type: String,
            trim: true,
            uppercase: true
        },
        reviewCount: {
            type: Number,
            default: 0
        },
        reviewValue: {
            type: Number,
            default: 0
        },
        features: [String],
        location: {
            address: {
                type: String,
                trim: true
            },
            city: {
                type: String,
                uppercase: true,
                trim: true
            },
            state: {
                type: String,
                uppercase: true,
                trim: true
            },
            postalCode: {
                type: String,
                uppercase: true,
                trim: true
            },
            country: {
                type: String,
                uppercase: true,
                trim: true
            }
        },
        guests: {
            type: Number,
            default: 0
        },
        bedrooms: {
            type: Number,
            default: 0
        },
        beds: {
            type: Number,
            default: 0
        },
        bathrooms: {
            type: Number,
            default: 0
        },
        images: [{
            type: mongoose.Schema.Types.ObjectID,
            ref: 'Image'
        }],
        _geoloc: {
            lat: {
                type: Number,
                default: 0
            },
            lng: {
                type: Number,
                default: 0
            }
        },
        owner: {
            type: mongoose.Schema.Types.ObjectID,
            required: true,
            ref: 'User'
        }

    }, {
        timestamps: true
    })

    homeSchema.virtual('reviews', {
        ref: 'Review',
        localField: '_id',
        foreignField: 'homeId'
    })

    homeSchema.virtual('availabilities', {
        ref: 'Availability',
        localField: '_id',
        foreignField: 'homeId'
    })

    const Home = getOrCreateModel(dbClient, 'Home', homeSchema)
    return Home
}