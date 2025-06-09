export default function bootstrapConfig(options) {
    const config = {}
    config.apiDb = options.privateRuntimeConfig.apiDb
    config.smtp = options.privateRuntimeConfig.smtp
    config.auth = {
        ...options.privateRuntimeConfig.auth,
        ...options.publicRuntimeConfig.auth
    }
    config.url = options.publicRuntimeConfig.url

    return config
}