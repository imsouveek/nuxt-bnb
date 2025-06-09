import { sendJSON } from '../../utils/response.js'

export default (services) => {
    async function create(req, res, next) {
        try {
            const newBooking = await services.booking.create(req.user._id, req.body)
            sendJSON(res, newBooking, 201)
        } catch (e) {
            next(e)
        }
    }

    async function get(req, res, next) {
        try {
            const bookingId = req.params.id
            const searchParams = {
                bookingId,
                homeId: req.query.homeId,
            }

            const result = await services.booking.get(searchParams, req.queryparams)

            // Return an object if looking for a specific booking, array otherwise
            sendJSON(res, result, 200)
        } catch (e) {
            next(e)
        }
    }

    async function update(req, res, next) {
        try {
            const result = await services.booking.update(req.user._id, req.params.id, req.body)
            sendJSON(res, result)
        } catch (e) {
            next(e)
        }
    }

    return {
        create,
        get,
        update
    }
}
