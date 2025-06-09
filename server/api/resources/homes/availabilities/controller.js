import { sendJSON } from '../../../utils/response.js'
import { validateOwnership } from '../helpers.js'

export default (services) => {

    async function create(req, res, next) {
        try {
            await validateOwnership(services, req.user._id, req.params.id) // homeId
            const result = await services.availability.create(
                req.params.id,           // homeId
                req.body.availabilities // expects array of epochDates
            )

            sendJSON(res, result, 201)
        } catch (e) {
            next(e)
        }
    }

    async function get(req, res, next) {
        try {
            await validateOwnership(services, req.user._id, req.params.id) // homeId
            const result = await services.availability.get(
                req.params.id,         // homeId
                req.queryparams
            )

            sendJSON(res, result)
        } catch (e) {
            next(e)
        }
    }

    async function remove(req, res, next) {
        try {
            await validateOwnership(services, req.user._id, req.params.id) // homeId
            const result = await services.availability.remove(
                req.params.id,           // homeId
                req.body.availabilityIds // expects array of _ids
            )

            sendJSON(res, result)
        } catch (e) {
            next(e)
        }
    }

    return {
        create,
        get,
        remove
    }
}