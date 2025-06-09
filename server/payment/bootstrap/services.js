import orderService from '../resources/orders/service.js'

export default (strategies, dbClient) => {
    return {
        order: orderService(strategies, dbClient),
    }
}