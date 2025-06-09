export default (models) => {

    async function create(homeData) {
        const newHome = new models.home({
            ...homeData
        })

        await newHome.save()
        return newHome
    }

    async function get(searchParams, queryparams) {
        const { homeId, userId, user } = searchParams
        const { fieldList, options } = queryparams

        const query = {}
        if (homeId) query._id = homeId
        if (userId) query.owner = userId
        if (user && typeof user === 'object') query.owner = user._id

        const results = await models.home.find(query, fieldList, options)

        return homeId ? results[0] || null : results
    }

    async function patch(userId, homeId, homeData) {
        const updates = Object.keys(homeData);
        const blockedUpdates = ['_id', 'owner', 'createdAt', 'updatedAt', '__v'];
        const isInvalid = updates.every((update) => blockedUpdates.includes(update));
        if (isInvalid) {
            throw new Error('Unsupported Operation')
        }

        const result = await models.home.findOne({ _id: homeId, owner: userId })
        if (!result) {
            throw new Error('Not Found')
        }

        updates.forEach((update) => result[update] = homeData[update])
        await result.save()
        return result
    }

    async function remove(userId, homeId) {
        const result = await models.home.findOneAndDelete({ _id: homeId, owner: userId })
        if (!result) {
            throw new Error('Not Found')
        }
        await models.image.deleteMany({
            _id: {
                $in: result.images
            }
        })
        await models.availability.deleteMany({
            homeId
        });
        return result
    }

    return {
        create,
        get,
        patch,
        remove
    }
}