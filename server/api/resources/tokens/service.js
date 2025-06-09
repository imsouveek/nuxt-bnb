export default (models) => {
    async function getNewToken(email, type) {
        if (type !== 'password' && type !== 'image') {
            throw new Error('Invalid token type')
        }

        let token
        token = await models.token.findOne({
            email
        })

        if (!token || type === 'image') {
            // Can have multiple image tokens, but only one password token
            token = new models.token({ email, type })
        }

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