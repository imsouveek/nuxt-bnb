export default function (url) {
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
        'endEpochBefore'
    ]

    return function (req, res, next) {
        // Middleware to parse query parameters and set them in req.queryparams
        const parsedUrl = new URL(`${url}${req.url}`)
        const searchParams = parsedUrl.searchParams

        const queryparams = {
            fieldList: null,
            options: {
                sort: {}
            }
        }

        for (const key of searchParams.keys()) {
            const values = searchParams.getAll(key)

            switch (key) {
                case 'fieldList':
                    queryparams.fieldList = values.join(' ')
                    break
                case 'sortBy':
                    queryparams.options.sort = values.reduce((obj, item) => {
                        const [field, order] = item.split('_')
                        obj[field] = order === 'asc' ? 1 : -1
                        return obj
                    }, {})
                    break
                default:
                    if (intFields.includes(key)) {
                        const parsedValue = parseInt(values[0])
                        if (!isNaN(parsedValue)) {
                            queryparams.options[key] = parsedValue
                        }
                    } else {
                        queryparams[key] = values.length > 1 ? values : values[0]
                    }
                    break
            }
        }

        req.queryparams = queryparams
        next()
    }
}
