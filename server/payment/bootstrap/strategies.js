import razorpayStrategy from '../strategies/razorpay.js'

export default (config) => {
    return {
        razorpay: razorpayStrategy(config),
    }
}