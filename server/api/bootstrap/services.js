import emailService from '../services/emails.js'

import userService from '../resources/users/service.js'
import tokenService from '../resources/tokens/service.js'

import homeService from '../resources/homes/service.js'
import reviewService from '../resources/homes/reviews/service.js'
import availabilityService from '../resources/homes/availabilities/service.js'
import searchService from '../resources/search/service.js'

import imageService from '../resources/images/service.js'

import bookingService from '../resources/bookings/service.js'
import getModels from './models.js'

export default (config, dbClient) => {
    const models = getModels(dbClient)
    return {
        user: userService(models, config.auth),
        home: homeService(models),
        image: imageService(models),
        token: tokenService(models),
        review: reviewService(models),
        search: searchService(models),
        availability: availabilityService(models),
        booking: bookingService(models, config.url.payment, config.paymentAuth),
        email: emailService(config.smtp, config.url.app)
    }
}
