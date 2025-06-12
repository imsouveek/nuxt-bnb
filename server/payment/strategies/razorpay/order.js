export default (razorpay) => {
    const create = async ({ bookingId, amount, currency = 'INR' }) => {
        const order = await razorpay.orders.create({
            amount: amount * 100,
            currency,
            receipt: bookingId
        })

        return {
            razorpayOrderId: order.id
        }
    }

    const verifyPayment = async (paymentId) => {
        const payment = await razorpay.payments.fetch(paymentId)
        return payment.status === 'captured'
    }

    return {
        create,
        verifyPayment
    }
}
