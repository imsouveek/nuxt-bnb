import { parse } from 'url'
import querystring from 'querystring'

export default function (req, res, next) {
    const parsedUrl = parse(req.url)
    const rawQuery = parsedUrl.query || ''
    const reqQuery = req.query || querystring.parse(rawQuery)

    const queryparams = { ...reqQuery }
    queryparams.options = {}

    // 🔢 Pagination
    const intFields = ['limit', 'skip']
    intFields.forEach((field) => {
        if (queryparams[field]) {
            const parsedValue = parseInt(queryparams[field])
            if (!isNaN(parsedValue)) {
                queryparams.options[field] = parsedValue
            }
            delete queryparams[field]
        }
    })

    // 📅 Date range filters
    if (queryparams.createdAfter || queryparams.createdBefore) {
        queryparams.createdAt = {}
        if (queryparams.createdAfter) {
            const after = new Date(queryparams.createdAfter)
            if (!isNaN(after.getTime())) {
                queryparams.createdAt.gte = after
            }
        }
        if (queryparams.createdBefore) {
            const before = new Date(queryparams.createdBefore)
            if (!isNaN(before.getTime())) {
                queryparams.createdAt.lte = before
            }
        }
        delete queryparams.createdAfter
        delete queryparams.createdBefore
    }

    // ↕ Sorting
    if (queryparams.sortBy) {
        const sort = {}
        queryparams.sortBy.split(',').forEach(item => {
            const [field, order] = item.split('_')
            sort[field] = order === 'asc' ? 'asc' : 'desc'
        })
        queryparams.options.orderBy = sort
        delete queryparams.sortBy
    }

    req.queryparams = queryparams
    next()
}
