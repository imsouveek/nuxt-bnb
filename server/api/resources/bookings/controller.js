import { sendJSON } from '../../utils/response.js'

export default (services) => {
    async function create(req, res, next) {
        try {
            const home = await services.home.get({ homeId: req.body.homeId, user: req.user })
            if (!home) {
                throw new Error("Home not found")
            }

            const availableHomes = await services.search.filterAvailableHomes([home], {
                options: {
                    ...req.body
                }
            })
            const availableUnBookedHomes = await services.search.filterBookedHomes(availableHomes, {
                excludeBooked: 'true',
                options: {
                    ...req.body
                }
            })

            if (availableUnBookedHomes.length === 0) {
                throw new Error("Home is not available")
            }

            const newBooking = await services.booking.create(req.user._id, home, req.body)
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

            sendJSON(res, result, 200)
        } catch (e) {
            next(e)
        }
    }

    async function update(req, res, next) {
        try {
            const booking = await services.booking.get({ bookingId: req.params.id, userId: req.user._id })
            if (!booking) {
                throw new Error("Booking not found")
            }
            const result = await services.booking.update(booking, req.body)
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
