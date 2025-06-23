import axios from 'axios'

export default (models, paymentUrl, paymentConfig) => {

    const create = async (user, home, data) => {
        const { startEpoch, endEpoch } = data
        const totalAmount = home.pricePerNight * (endEpoch - startEpoch)

        let booking = await models.booking.create({
            ...data,
            home: home._id,
            totalAmount,
            user
        })

        let payment
        try {
            const { auth_header: pay_header, auth_key: pay_key } = paymentConfig
            payment = await axios.post(`${paymentUrl}/orders`, {
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
            throw new Error(`Payment failed with ${err}`)
        }

        booking.paymentId = payment?.data?.id
        booking.status = payment?.data?.status
        await booking.save()
        return {
            booking,
            gatewayRefs: payment?.data?.gatewayRefs
        }
    }

    async function get(searchParams, queryparams = {}) {
        const { bookingId, homeId, userId } = searchParams
        const { fieldList, options = {}, ...filters } = queryparams

        const query = { ...filters }
        if (bookingId) query._id = bookingId
        if (homeId) query.home = homeId
        if (userId) query.user = userId

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
            .populate('home')
            .populate('user')

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
