import orderService from '../resources/orders/service.js'
import webhookService from '../resources/webhooks/service.js'

export default (strategies, dbClient, config) => {
    return {
        order: orderService(strategies, dbClient),
        webhook: webhookService(strategies, dbClient, config)
    }
}
