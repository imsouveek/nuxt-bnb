import getServices from './services.js'
import getStrategies from './strategies.js'
import getMiddleware from '../middleware/index.js'

import orderController from '../resources/orders/controller.js'
import webhookController from '../resources/webhooks/controller.js'

export default (config, dbClient) => {
    const strategies = getStrategies(config)
    const services = getServices(strategies, dbClient, config)

    return {
        order: orderController(services),
        webhook: webhookController(services),
        middleware: getMiddleware(config.auth)
    }
}