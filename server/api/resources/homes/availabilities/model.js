import mongoose from 'mongoose'
import { getOrCreateModel } from '../../../utils/getModel'

export default (dbClient) => {
    const availabilitySchema = new mongoose.Schema({
        epochDate: {
            type: Number,
            required: true
        },
        homeId: {
            type: mongoose.Schema.Types.ObjectID,
            required: true,
            ref: 'Home'
        }
    }, {
        timestamps: true
    })

    availabilitySchema.index({
        homeId: 1,
        epochDate: 1
    }, {
        unique: true
    })

    const Availability = getOrCreateModel(dbClient, 'Availability', availabilitySchema)
    return Availability
}
