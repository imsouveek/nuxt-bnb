export default (models) => {
    const METERS_PER_DEGREE = 111111

    async function findHomes(queryparams) {
        const homes = await getHomesByLocation(queryparams)
        const availableHomes = await filterAvailableHomes(homes, queryparams)
        const unbookedHomes = await filterBookedHomes(availableHomes, queryparams)
        return unbookedHomes
    }

    async function getHomesByLocation({ lat, lng, radius = 10000, fieldList, options }) {
        if (lat && lng) {
            const latNum = parseFloat(lat)
            const lngNum = parseFloat(lng)
            const radiusNum = parseFloat(radius)

            if (isNaN(latNum) || isNaN(lngNum) || isNaN(radiusNum)) {
                throw new Error('Invalid Location')
            }

            const delta = radiusNum / METERS_PER_DEGREE
            const geoFilter = {
                '_geoloc.lat': { $gte: latNum - delta, $lte: latNum + delta },
                '_geoloc.lng': { $gte: lngNum - delta, $lte: lngNum + delta }
            }

            return await models.home.find(geoFilter, fieldList, options)
        }

        // No location filter — return all homes with pagination
        return await models.home.find({}, fieldList, options)
    }

    async function filterAvailableHomes(homes, { options }) {
        const { startEpoch, endEpoch } = options
        if (!startEpoch || !endEpoch) return homes

        if (startEpoch > endEpoch) {
            throw new Error('startEpoch must be before or equal to endEpoch')
        }

        const homeIds = homes.map(h => h._id)

        const availabilityDocs = await models.availability.find({
            homeId: { $in: homeIds },
            epochDate: { $gte: startEpoch, $lte: endEpoch }
        })

        const unavailableHomeIds = new Set(availabilityDocs.map(a => String(a.homeId)))
        return homes.filter(home => !unavailableHomeIds.has(String(home._id)))
    }

    async function filterBookedHomes(homes, { excludeBooked, options }) {
        const { startEpoch, endEpoch } = options
        if (excludeBooked !== 'true' || !startEpoch || !endEpoch) return homes

        const homeIds = homes.map(h => h._id)
        const bookings = await models.booking.find({
            home: { $in: homeIds },
            status: { $in: ['Pending', 'Success'] },
            startEpoch: { $lt: endEpoch },
            endEpoch: { $gt: startEpoch }
        })

        const bookedHomeIds = new Set(bookings.map(b => String(b.home)))
        return homes.filter(home => !bookedHomeIds.has(String(home._id)))
    }


    async function getById(homeId, queryparams) {
        const { fieldList, options } = queryparams
        return await models.home.findById(homeId, fieldList, options)
    }

    async function populate(home, path, queryparams) {
        const { fieldList, options } = queryparams
        return await home.populate({
            path,
            select: fieldList,
            options
        })
    }

    return {
        findHomes,
        getHomesByLocation,
        filterAvailableHomes,
        filterBookedHomes,
        getById,
        populate
    }
}
