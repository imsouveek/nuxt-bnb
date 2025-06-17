export default function (auth) {
    const authHeader = auth.auth_header.toLowerCase()
    const authKey = auth.auth_key

    return function (req, res, next) {
        const incoming = req.headers[authHeader]
        if (incoming && incoming === authKey) {
            req.internalAuth = true
        }
        next()
    }
}