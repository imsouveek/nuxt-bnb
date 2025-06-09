import { sendJSON } from '../../utils/response.js'

export default (services) => {
    async function validateStrategy(type) {
        return type === 'Razorpay'
    }

    async function create(req, res, next) {
        try {
            const { type, ...data } = req.body
            if (!type || !validateStrategy(type)) {
                return sendJSON(res, {
                    error: "Invalid or missing Strategy"
                }, 400)
            }
            const newOrder = await services.order.create(type, data)

            sendJSON(res, newOrder, 201)
        } catch (e) {
            next(e)
        }
    }

    async function get(req, res, next) {
        try {
            const orderId = req.params.id
            const result = await services.order.get(orderId)

            sendJSON(res, result || {}, result ? 200 : 404);
        } catch (e) {
            next(e)
        }
    }

    async function list(req, res, next) {
        try {
            const result = await services.order.list(req.queryparams)

            sendJSON(res, result, result.length > 0 ? 200 : 404);
        } catch (e) {
            next(e)
        }
    }
    return {
        create,
        get,
        list
    }
}