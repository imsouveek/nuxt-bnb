import getServices from './services.js'

import authController from '../resources/auth/controller.js'
import userController from '../resources/users/controller.js'

import homeController from '../resources/homes/controller.js'
import reviewController from '../resources/homes/reviews/controller.js'
import availabilityController from '../resources/homes/availabilities/controller.js'
import searchController from '../resources/search/controller.js'

import imageController from '../resources/images/controller.js'

import bookingController from '../resources/bookings/controller.js'

import getMiddleware from '../middleware/index.js'

export default (config, dbClient) => {
    const services = getServices(config, dbClient)
    return {
        auth: authController(services, config.auth),
        user: userController(services, config.auth),
        home: homeController(services),
        image: imageController(services),
        review: reviewController(services),
        search: searchController(services),
        availability: availabilityController(services),
        booking: bookingController(services),
        middleware: getMiddleware(services, config.auth)
    }
}