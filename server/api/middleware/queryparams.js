import { parse } from 'url'
import querystring from 'querystring'

export default function (req, res, next) {
    // Middleware to parse query parameters and set them in req.queryparams
    const parsedUrl = parse(req.url)
    const rawQuery = parsedUrl.query || ''
    const reqQuery = req.query || querystring.parse(rawQuery)

    const queryparams = { ...reqQuery }
    queryparams.options = {}

    if (queryparams.fieldList) {
        queryparams.fieldList = queryparams.fieldList.replaceAll(',', ' ')
    } else {
        queryparams.fieldList = null
    }

    if (queryparams.sortBy) {
        const sort = {}
        queryparams.sortBy.split(',').forEach(item => {
            const [field, order] = item.split('_')
            sort[field] = order === 'asc' ? 1 : -1
        })
        queryparams.options.sort = sort
        delete queryparams.sortBy
    }

    const intFields = [
        'limit',
        'skip',
        'width',
        'height',
        'startEpoch',
        'endEpoch',
        'startEpochAfter',
        'startEpochBefore',
        'endEpochAfter',
        'endEpochBefore']

    intFields.forEach((field) => {
        if (queryparams[field]) {
            const parsedValue = parseInt(queryparams[field])
            if (!isNaN(parsedValue)) {
                queryparams.options[field] = parsedValue
            }
            delete queryparams[field]
        }
    })

    req.queryparams = queryparams
    next()
}