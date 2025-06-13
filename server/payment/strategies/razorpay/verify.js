import crypto from 'crypto'

export default ({ webhook_secret, key_secret }) => {

    const extractHeaders = (headers) => {
        const signature = headers['x-razorpay-signature']
        const eventId = headers['x-razorpay-event-id']
        if (!signature || !eventId) throw new Error("Request is missing required headers")
        return { signature, eventId }
    }

    const webhook = ({ rawBody, signature }) => {

        const expected = crypto
            .createHmac('sha256', webhook_secret)
            .update(rawBody)
            .digest('hex')

        if (expected !== signature) return null

        const event = JSON.parse(rawBody)
        const payment = event.payload?.payment?.entity
        const paymentId = payment?.id ?? ''

        return {
            status: event.event,
            orderId: payment?.order_id,
            paymentId,
            updateData: {
                razorpayPaymentId: paymentId,
                razorpaySignature: signature
            }
        }
    }

    const client = ({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) => {
        const expected = crypto
            .createHmac('sha256', key_secret)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex')

        if (expected !== razorpay_signature) return null

        return {
            status: 'payment.captured',
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id,
            updateData: {
                razorpayPaymentId: razorpay_payment_id,
                razorpaySignature: razorpay_signature
            }
        }
    }

    return {
        extractHeaders,
        webhook,
        client
    }
}