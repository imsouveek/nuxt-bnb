import { randomUUID } from 'crypto'
import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { getOrCreateModel } from '../../utils/getModel.js'

export default (dbClient) => {
    const userSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            unique: true,
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
        description: {
            type: String,
            trim: true
        },
        password: {
            type: String,
            required: true,
            minLength: 6,
            trim: true,
            validate: {
                validator: function (v) {
                    return (!!v && v !== 'password')
                },
                message: props => `${props.value} is not a valid password`
            }
        },
        authStrategy: {
            type: String,
            required: true,
            trim: true,
            validate: {
                validator: function (v) {
                    return (v === 'local' || v === 'google')
                },
                message: props => `${props.value} is not a valid authentication strategy`
            }
        },
        reviewCount: {
            type: Number,
            default: 0
        },
        image: {
            type: mongoose.Schema.Types.ObjectID,
            ref: 'Image'
        },
        tokens: [{
            token: {
                type: String,
                required: true
            }
        }]
    }, {
        timestamps: true
    })

    userSchema.virtual('homes', {
        ref: 'Home',
        localField: '_id',
        foreignField: 'owner'
    })

    userSchema.methods.toJSON = function () {
        const user = this.toObject()

        // Delete sensitive data
        delete user.password
        delete user.tokens
        delete user.authStrategy

        return user
    }

    userSchema.methods.getAuthToken = async function (auth, token) {
        const user = this
        const refresh_token = jwt.sign({ _id: user._id.toString(), jti: randomUUID() }, auth.refresh_secret, { expiresIn: auth.refresh_life })
        const access_token = jwt.sign({ _id: user._id.toString(), jti: randomUUID() }, auth.access_secret, { expiresIn: auth.access_life })

        if (token) {
            user.tokens = user.tokens.filter(t => t.token !== token)
        }

        user.tokens = user.tokens.concat({ token: refresh_token })
        await user.save()
        return {
            refresh_token,
            access_token
        }
    }

    userSchema.statics.getCredentials = async (email, password, strategy) => {
        const result = await User.findOne({ email })

        if (!result) {
            throw new Error('Unable to login')
        }

        if (result.authStrategy !== strategy) {
            throw new Error('Unable to login')
        }

        if (strategy === 'local') {
            const isMatch = await bcrypt.compare(password, result.password)

            if (!isMatch) {
                throw new Error('Unable to login')
            }
        }
        return result
    }

    userSchema.pre('save', async function (next) {
        const user = this

        if (user.isModified('password')) {
            user.password = await bcrypt.hash(user.password, 8)
        }

        next()
    })

    const User = getOrCreateModel(dbClient, 'User', userSchema)
    return User
}
