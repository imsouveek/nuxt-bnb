import mongoose from 'mongoose'
import validator from 'validator'
import { randomUUID } from 'crypto'
import { getOrCreateModel } from '../../utils/getModel.js'

export default (dbClient) => {
    const tokenSchema = new mongoose.Schema({
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            validate: {
                validator: function (v) {
                    return validator.isEmail(v)
                },
                message: props => `${props.value} is not a valid email`
            }
        },
        type: {
            type: String,
            required: true,
            enum: {
                values: ['image', 'password'],
                message: '{VALUE} is not supported'
            }
        },
        token: {
            type: String,
            unique: true
        },
        expiresAt: {
            type: Date,
            default: null
        }
    }, {
        timestamps: true
    })

    tokenSchema.pre('save', async function (next) {
        const token = this

        token.token = randomUUID()

        next()
    })

    const Token = getOrCreateModel(dbClient, 'Token', tokenSchema)
    return Token
}