export default (strategies, dbClient) => {

    const create = async (type, data) => {
        const { bookingId, amount, status = 'New' } = data
        const strategy = strategies[type.toLowerCase()]

        const order = await dbClient.order.create({
            data: {
                bookingId,
                amount,
                status,
                gateway: {
                    create: {
                        type: strategy.name,
                        ...strategy.db.create()
                    }
                }
            },
            include: {
                gateway: {
                    include: strategy.db.select()
                }
            }
        })
        try {
            const gatewayPayload = await strategy.order.create({ bookingId, amount, orderId: order.id })
            return await dbClient.order.update({
                where: { id: order.id },
                data: {
                    status: 'Pending',
                    gateway: {
                        update: {
                            ...strategy.db.update(gatewayPayload)
                        }
                    }
                },
                include: {
                    gateway: {
                        include: strategy.db.select()
                    }
                }
            })
        } catch (error) {
            console.log(error)
            return order
        }
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
        if (!strategy) return base

        const gatewayId = base.gateway?.id
        const extra = await strategy.db.find(dbClient, { gatewayId })

        return {
            ...base,
            gateway: {
                ...base.gateway,
                [strategyKey]: extra
            }
        }
    }

    const processResponse = (order) => {
        if (!order) return null

        const response = JSON.parse(JSON.stringify(order))
        delete response.gatewayId
        delete response.gateway

        response.gatewayType = order.gateway?.type ?? ''
        if (response.gatewayType) {
            const strategyKey = response.gatewayType.toLowerCase()
            const strategy = strategies[strategyKey]

            response.gatewayRefs = strategy.order.getGatewayRefs(order)
        }
        return response
    }

    return {
        create,
        get,
        processResponse
    }
}