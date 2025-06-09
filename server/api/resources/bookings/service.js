export default (models) => {

    const create = async (userId, data) => {
        const { homeId, startEpoch, endEpoch } = data
        const home = await models.home.findOne({ _id: homeId })

        const totalAmount = home.pricePerNight * (endEpoch - startEpoch)

        return models.booking.create({
            ...data,
            totalAmount,
            userId
        })
    }

    async function get(searchParams, queryparams) {
        const { bookingId, homeId } = searchParams
        const { fieldList, options, ...filters } = queryparams

        const query = { ...filters }
        if (bookingId) query._id = bookingId
        if (homeId) query.homeId = homeId

        const {
            startEpochAfter,
            startEpochBefore,
            endEpochAfter,
            endEpochBefore,
            ...restOptions
        } = options

        if (startEpochAfter !== undefined) {
            query.startEpoch = { $gte: startEpochAfter }
        }
        if (startEpochBefore !== undefined) {
            query.startEpoch = { ...(query.startEpoch || {}), $lte: startEpochBefore }
        }
        if (endEpochAfter !== undefined) {
            query.endEpoch = { $gte: endEpochAfter }
        }
        if (endEpochBefore !== undefined) {
            query.endEpoch = { ...(query.endEpoch || {}), $lte: endEpochBefore }
        }

        const results = await models.booking.find(query, fieldList, restOptions)
            .populate('homeId')
            .populate('userId')
            .lean()

        return bookingId ? results[0] || {} : results
    }

    const update = async (userId, bookingId, updateData) => {
        const booking = await models.booking.findOne({ _id: bookingId, userId })

        if (!booking) {
            throw new Error('Booking not found or access denied')
        }

        const updates = Object.keys(updateData);
        const allowedUpdates = ['status', 'paymentId'];
        const isValid = updates.every((update) => allowedUpdates.includes(update));
        if (!isValid) {
            throw new Error('Invalid Request')
        }

        updates.forEach((update) => booking[update] = updateData[update])

        await booking.save()
        return booking
    }

    return {
        create,
        get,
        update
    }
}
