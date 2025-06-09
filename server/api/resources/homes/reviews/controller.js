import { sendJSON } from '../../../utils/response.js'
import { validateOwnership } from '../helpers.js'


export default (services) => {
    async function get(req, res, next) {
        try {
            await validateOwnership(services, req.user._id, req.params.id) // homeId
            const reviews = await services.review.getByHomeId(req.params.id, req.queryparams)
            sendJSON(res, reviews)
        } catch (e) {
            next(e)
        }
    }

    return { get }
}