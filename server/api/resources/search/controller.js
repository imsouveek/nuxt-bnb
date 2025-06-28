import { sendJSON } from '../../utils/response.js'

export default (services) => {
    async function getHomes (req, res, next) {
        try {
            const homes = await services.search.findHomes(req.queryparams)
            sendJSON(res, homes)
        } catch (e) {
            next(e)
        }
    }

    async function getHomeById (req, res, next) {
        try {
            const homeId = req.params.id
            const home = await services.search.getById(homeId, req.queryparams)
            sendJSON(res, home || {}, home ? 200 : 404)
        } catch (e) {
            next(e)
        }
    }

    async function getHomePath (req, res, next) {
        try {
            const homeId = req.params.id
            const path = req.params.path

            const home = await services.search.getById(homeId, req.queryparams)
            if (!home) {
                return sendJSON(res, { error: 'Not Found' }, 404)
            }

            const result = await services.search.populate(home, path, req.queryparams)
            sendJSON(res, result[path])
        } catch (e) {
            next(e)
        }
    }

    return {
        getHomes,
        getHomeById,
        getHomePath
    }
}
