import razorpayStrategy from '../strategies/razorpay/index.js'

export default (config) => {
    return {
        razorpay: razorpayStrategy(config),
    }
}