import mongoose from 'mongoose'

export default (models) => {
    async function create (homeId, incomingEpochs) {
        const existingRecords = await models.availability.find({ homeId }, { epochDate: 1 })
        const existingSet = new Set(existingRecords.map(r => r.epochDate))
        const incomingSet = new Set(incomingEpochs)

        const toInsert = [...incomingSet].filter(e => !existingSet.has(e))
        const toDelete = [...existingSet].filter(e => !incomingSet.has(e))

        const bulkOps = []

        for (const epochDate of toInsert) {
            bulkOps.push({
                insertOne: {
                    document: {
                        homeId,
                        epochDate
                    }
                }
            })
        }

        if (toDelete.length > 0) {
            bulkOps.push({
                deleteMany: {
                    filter: {
                        homeId,
                        epochDate: {
                            $in: toDelete
                        }
                    }
                }
            })
        }

        if (bulkOps.length > 0) {
            await models.availability.bulkWrite(bulkOps, { ordered: false })
        }

        return await models.availability.find({ homeId })
    }

    async function get (homeId, queryParams) {
        const { fieldList, options } = queryParams
        const filter = { homeId }
        const { startEpoch, endEpoch } = options

        if (startEpoch && endEpoch) {
            if (startEpoch > endEpoch) {
                throw new Error('startEpoch must be before or equal to endEpoch')
            }
            filter.epochDate = { $gte: startEpoch, $lte: endEpoch }
        }

        return await models.availability.find(filter, fieldList, options)
    }

    async function remove (homeId, availabilityIds) {
        return await models.availability.deleteMany({
            _id: { $in: availabilityIds.map(id => new mongoose.Types.ObjectId(id)) },
            homeId
        })
    }

    return {
        create,
        get,
        remove
    }
}
