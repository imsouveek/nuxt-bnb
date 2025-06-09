import Razorpay from 'razorpay'

export default (config) => {
    const razorpay = new Razorpay(config.razorpay);

    const queryInclude = () => ({
        razorpay: true
    })

    const prepare = () => {
        return {
            create: {
                type: 'Razorpay',
                razorpay: {
                    create: {
                        razorpayOrderId: '',
                        razorpayPaymentId: '',
                        razorpaySignature: ''
                    }
                }
            }
        }
    }

    const createOrder = async (data) => {
        const { bookingId, amount, currency = "INR" } = data
        const order = await razorpay.orders.create({
            amount: amount * 100,
            currency,
            receipt: bookingId
        })

        return {
            razorpay: {
                update: {
                    data: {
                        razorpayOrderId: order.id
                    }
                }
            }
        }
    }

    const enrich = async (order, dbClient) => {
        const gatewayId = order.gateway?.id

        const razorpayMeta = await dbClient.razorpay.findUnique({
            where: {
                gatewayId,
            },
        })

        return {
            ...order,
            gateway: {
                ...order.gateway,
                razorpay: razorpayMeta,
            },
        }
    }

    return {
        queryInclude,
        prepare,
        createOrder,
        enrich
    }
}