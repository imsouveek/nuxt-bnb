import ms from 'ms'

export default (models) => {
    async function getNewToken(email, type, token_life) {
        let expiresAt = null
        if (token_life !== 'never') {
            expiresAt = new Date(Date.now() + ms(token_life))
        }

        let token
        token = await models.token.findOne({
            email
        })

        if (!token || type === 'image') {
            // Can have multiple image tokens, but only one password token
            token = new models.token({ email, type })
        }

        token.expiresAt = expiresAt
        await token.save()

        return token
    }

    async function validateToken(token, type) {
        const tokenObj = await models.token.findOne({
            token
        })

        if (!tokenObj) {
            throw new Error('Invalid Token')
        }

        await models.token.findOneAndDelete({ _id: tokenObj._id })

        if (tokenObj.expiresAt && new Date(tokenObj.expiresAt) < new Date()) {
            throw new Error('Token has expired')
        }

        if (tokenObj.type !== type) {
            throw new Error(`Invalid token type`)
        }

        const user = await models.user.findOne({
            email: tokenObj.email
        })

        return user
    }

    return {
        getNewToken,
        validateToken
    }
}