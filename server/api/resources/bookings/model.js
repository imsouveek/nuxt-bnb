import mongoose from 'mongoose'
import { getOrCreateModel } from '../../utils/getModel.js'

export default (dbClient) => {
    const bookingSchema = new mongoose.Schema({
        homeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Home',
            required: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        startEpoch: {
            type: Number,
            required: true
        },
        endEpoch: {
            type: Number,
            required: true
        },
        guestCount: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            enum: ['New', 'Pending', 'Success', 'Failed'],
            default: 'New'
        },
        totalAmount: {
            type: Number,
            required: true,
        },
        paymentId: {
            type: String,
            required: false, // initially null until payment is created
        }
    }, {
        timestamps: true
    })

    const Booking = getOrCreateModel(dbClient, 'Booking', bookingSchema)
    return Booking
}
