import userModel from '../resources/users/model.js'
import tokenModel from '../resources/tokens/model.js'

import homeModel from '../resources/homes/model.js'
import reviewModel from '../resources/homes/reviews/model.js'
import availabilityModel from '../resources/homes/availabilities/model.js'

import imageModel from '../resources/images/model.js'

import bookingsModel from '../resources/bookings/model.js'

export default (dbClient) => {
    return {
        user: userModel(dbClient),
        home: homeModel(dbClient),
        token: tokenModel(dbClient),
        review: reviewModel(dbClient),
        image: imageModel(dbClient),
        availability: availabilityModel(dbClient),
        booking: bookingsModel(dbClient),
    }
}