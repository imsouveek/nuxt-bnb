import { sendJSON } from '../../utils/response.js'

export default (services) => {
    async function create (req, res, next) {
        try {
            const safeData = { ...req.body }
            delete safeData._id
            delete safeData.owner
            const newHome = await services.home.create({ ...safeData, owner: req.user._id })
            sendJSON(res, newHome, 201)
        } catch (e) {
            next(e)
        }
    }

    async function get (req, res, next) {
        try {
            const homeId = req.params.id
            const result = await services.home.get(
                homeId ? { homeId, userId: req.user._id } : { user: req.user },
                req.queryparams
            )
            sendJSON(res, result || {}, result ? 200 : 404)
        } catch (e) {
            next(e)
        }
    }

    async function patch (req, res, next) {
        try {
            const result = await services.home.patch(req.user._id, req.params.id, req.body)
            sendJSON(res, result)
        } catch (e) {
            next(e)
        }
    }

    async function remove (req, res, next) {
        try {
            const result = await services.home.remove(req.user._id, req.params.id)
            sendJSON(res, result)
        } catch (e) {
            next(e)
        }
    }

    return {
        create,
        get,
        patch,
        remove
    }
}
