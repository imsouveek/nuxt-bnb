export default function bootstrapConfig(options) {
    const config = {}
    config.paymentDb = options.privateRuntimeConfig.paymentDb
    config.razorpay = {
        ...options.privateRuntimeConfig.razorpay,
        ...options.publicRuntimeConfig.razorpay
    }
    config.auth = options.privateRuntimeConfig.paymentAuth
    config.url = options.publicRuntimeConfig.url

    return config
}