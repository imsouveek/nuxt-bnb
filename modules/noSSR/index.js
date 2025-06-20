export default function () {
    this.nuxt.hook('render:setupMiddleware', (app) => {
        app.use('/admin', (req, res, next) => {
            res.spa = true
            next()
        })
        app.use('/booking', (req, res, next) => {
            res.spa = true
            next()
        })
    })

}