import { sendJSON } from '../../utils/response.js'

export default (services) => {

    async function completeOrder(req, res, next) {
        try {
            const { gateway } = req.params;
            await services.webhook.process(req, gateway)
            sendJSON(res, {
                message: "Completed Successfully"
            })
        } catch (e) {
            next(e)
        }
    }

    async function completeClientOrder(req, res, next) {
        try {
            const { gateway } = req.params;
            await services.webhook.clientProcess(req, gateway)
            sendJSON(res, {
                message: "Completed Successfully"
            }, 200)
        } catch (e) {
            next(e)
        }
    }
    return {
        completeOrder,
        completeClientOrder
    }
}