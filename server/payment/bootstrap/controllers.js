import getServices from './services.js'
import getStrategies from './strategies.js'
import getMiddleware from '../middleware/index.js'

import orderController from '../resources/orders/controller.js'

export default (config, dbClient) => {
    const strategies = getStrategies(config)
    const services = getServices(strategies, dbClient)

    return {
        order: orderController(services),
        middleware: getMiddleware()
    }
}