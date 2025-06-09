export default function bootstrapConfig(options) {
    const config = {}
    config.paymentDb = options.privateRuntimeConfig.paymentDb
    config.razorpay = options.privateRuntimeConfig.razorpay

    return config
}