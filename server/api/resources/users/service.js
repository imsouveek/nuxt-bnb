export default (models, auth) => {
    async function create(userData, authStrategy) {
        const newUser = new models.user({
            ...userData,
            authStrategy
        })

        await newUser.save()
        return newUser
    }

    async function get(userId, fieldList) {
        const user = await models.user.findOne({
            _id: userId
        }, fieldList)

        return user
    }

    async function patch(user, updateData) {
        const updates = Object.keys(updateData);
        const allowedUpdates = ['name', 'email', 'password', 'image', 'description', 'reviewCount'];
        const isValid = updates.every((update) => allowedUpdates.includes(update));
        if (!isValid) {
            throw new Error('Invalid Request')
        }

        // Want to do special handling for images
        if (updateData.image && user.image && user.image.toString() !== updateData.image) {
            await models.image.findByIdAndDelete(user.image.toString())
        }

        updates.forEach((update) => user[update] = updateData[update])
        await user.save()
        return user
    }

    async function remove(user) {
        await Promise.all([
            models.user.findByIdAndDelete(user._id.toString()),
            models.home.deleteMany({
                owner: user._id
            }),
            models.image.findByIdAndDelete(user.image?.toString())
        ])

        return user
    }

    async function removeToken(user, token) {
        user.tokens = user.tokens.filter((t) => t.token !== token)
        await user.save()
        return user
    }

    async function removeAllTokens(user) {
        user.tokens = []
        await user.save()
        return user

    }

    async function validateUser(email, password, strategy) {
        return await models.user.getCredentials(email, password, strategy)
    }

    async function validateToken(userId, token) {
        return await models.user.findOne({
            _id: userId,
            'tokens.token': token
        })
    }

    async function getNewToken(user, refresh_token) {
        let response = { user }
        if (!refresh_token) {
            response.refresh_token = await user.getAuthToken(auth.refresh_secret, auth.refresh_life, true)
        }
        response.access_token = await user.getAuthToken(auth.access_secret, auth.access_life, false)
        return response
    }

    return {
        create,
        get,
        patch,
        remove,
        removeToken,
        removeAllTokens,
        validateUser,
        validateToken,
        getNewToken
    }
}