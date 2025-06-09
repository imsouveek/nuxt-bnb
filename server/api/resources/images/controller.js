import { sendJSON, sendJPEG } from '../../utils/response.js'

export default (services) => {
    async function create(req, res, next) {
        try {
            const token = req.headers['upload-token']?.trim()
            if (!token) {
                return sendJSON(res, { error: 'Missing upload token' }, 400)
            }

            const userFromToken = await services.token.validateToken(token, 'image')

            if (!req.user || req.user._id.toString() !== userFromToken._id.toString()) {
                return sendJSON(res, { error: 'Token does not belong to the authenticated user' }, 403)
            }

            const image = await services.image.setImage(req.body.data, req.body.tags, req.body.description)
            sendJSON(res, {
                id: image._id
            }, 201)
        } catch (e) {
            next(e)
        }
    }

    async function get(req, res, next) {
        try {
            const result = await services.image.getImage(req.params.id, req.queryparams)
            sendJPEG(res, result)
        } catch (e) {
            next(e)
        }
    }

    async function remove(req, res, next) {
        try {
            const token = req.headers['upload-token']?.trim()
            if (!token) {
                return sendJSON(res, { error: 'Missing delete token' }, 400)
            }

            const userFromToken = await services.token.validateToken(token, 'image')

            if (!req.user || req.user._id.toString() !== userFromToken._id.toString()) {
                return sendJSON(res, { error: 'Token does not belong to the authenticated user' }, 403)
            }

            await services.image.deleteImage(req.params.id)
            sendJSON(res, {
                id: req.params.id
            })
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