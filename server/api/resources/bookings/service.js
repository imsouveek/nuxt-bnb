import axios from 'axios'

export default (models, paymentUrl, paymentConfig) => {

    const create = async (userId, home, data) => {
        const { startEpoch, endEpoch } = data
        const totalAmount = home.pricePerNight * (endEpoch - startEpoch)

        let booking = await models.booking.create({
            ...data,
            totalAmount,
            userId
        })

        let payment
        try {
            const { auth_header: pay_header, auth_key: pay_key } = paymentConfig
            payment = await axios.post(paymentUrl, {
                bookingId: booking._id,
                amount: totalAmount,
                type: data.gateway
            }, {
                headers: {
                    [pay_header]: pay_key
                }
            })
            if (payment.status !== 201) {
                throw new Error("Could not contact payment gateway")
            }
        } catch (err) {
            throw new Error("Payment failed")
        }

        booking.paymentId = payment?.data?.id
        booking.status = payment?.data?.status
        await booking.save()
        return booking
    }

    async function get(searchParams, queryparams = {}) {
        const { bookingId, homeId, userId } = searchParams
        const { fieldList, options = {}, ...filters } = queryparams

        const query = { ...filters }
        if (bookingId) query._id = bookingId
        if (homeId) query.homeId = homeId
        if (userId) query.userId = userId

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

        return bookingId ? results[0] || null : results
    }

    const update = async (booking, updateData) => {
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
