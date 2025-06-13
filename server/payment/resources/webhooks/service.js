export default (strategies, dbClient) => {

    const process = async (req, gateway) => {
        const strategy = strategies[gateway]
        const { eventId, signature } = strategy.verify.extractHeaders(req.headers)

        // Idempotency check
        const alreadyProcessed = await dbClient.webhookEvent.findUnique({
            where: {
                eventId
            },
            select: {
                id: true
            }
        })
        if (alreadyProcessed) {
            console.log("Duplicate event")
            return
        }

        // Signature verification
        const result = strategy.verify.webhook({
            rawBody: req.rawBody,
            signature,
        })
        if (!result) throw new Error('Invalid signature')

        // Update payment and save webhook event
        const gatewayId = await updateOrder(gateway, result)

        await dbClient.webhookEvent.create({
            data: {
                eventId,
                gateway: strategy.name,
                gatewayId,
                status: result.status,
                rawBody: req.rawBody
            }
        })
    }

    const clientProcess = async (req, gateway) => {
        const strategy = strategies[gateway]
        const result = strategy.verify.client(req.body)
        if (!result) throw new Error('Invalid client-side signature')

        return await updateOrder(gateway, result)
    }

    const updateOrder = async (gateway, { status, orderId, paymentId, updateData }) => {
        const strategy = strategies[gateway]
        const orderStatus = (status === 'payment.captured') ? 'Success' : 'Failed'

        const gatewayRecord = await strategy.db.find(dbClient, strategy.orderIdMatch(orderId))
        if (!gatewayRecord) {
            console.log("No order found")
            return ''
        }

        if (orderStatus === 'Success') {
            const isRealPayment = await strategy.order.verifyPayment(paymentId)
            if (!isRealPayment) throw new Error(`Failed payment check at ${strategy.name}`)
        }

        // Step 2: Update Order using gatewayId (which is unique and indexed)
        await dbClient.order.update({
            where: { gatewayId: gatewayRecord.gatewayId },
            data: {
                status: orderStatus,
                gateway: {
                    update: {
                        ...strategy.db.update(updateData)
                    }
                }
            }
        })

        return gatewayRecord.gatewayId

    }

    return {
        process,
        clientProcess
    }
}
