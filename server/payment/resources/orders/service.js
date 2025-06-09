export default (strategies, dbClient) => {

    const create = async (type, data) => {
        const { bookingId, amount, status = 'New' } = data
        const strategy = strategies[type.toLowerCase()]

        const order = await dbClient.order.create({
            data: {
                bookingId,
                amount,
                status,
                gateway: strategy.prepare()
            }
        })

        return await dbClient.order.update({
            where: {
                id: order.id
            },
            data: {
                status: 'Pending',
                gateway: {
                    update: {
                        data: await strategy.createOrder(data)
                    }
                }
            },
            include: {
                gateway: {
                    include: strategy.queryInclude()
                }
            }
        })
    }

    const get = async (id) => {
        const base = await dbClient.order.findUnique({
            where: { id },
            include: {
                gateway: true,
            },
        })

        if (!base) return null

        const strategyKey = base.gateway?.type?.toLowerCase()
        const strategy = strategies[strategyKey]

        if (strategy && strategy.enrich) {
            return await strategy.enrich(base, dbClient)
        }

        return base
    }

    const list = async (queryparams) => {
        const {
            bookingId,
            status,
            gatewayType,
            createdAt
        } = queryparams

        const {
            limit = 20,
            skip = 0,
            orderBy = {
                createdAt: 'desc'
            }
        } = queryparams.options

        // Build dynamic WHERE clause
        const where = {}
        if (bookingId) where.bookingId = bookingId
        if (status) where.status = status
        if (gatewayType) {
            where.gateway = { type: gatewayType }
        }
        if (createdAt) {
            where.createdAt = createdAt
        }

        // Resolve strategy if gatewayType is provided
        const strategyKey = gatewayType?.toLowerCase()
        const strategy = strategyKey ? strategies[strategyKey] : null

        const include = {
            gateway: {
                include: strategy?.queryInclude?.() || {},
            },
        }

        const orders = await dbClient.order.findMany({
            where,
            include,
            skip: Number(skip),
            take: Number(limit),
            orderBy
        })

        return orders
    }

    return {
        create,
        get,
        list
    }
}