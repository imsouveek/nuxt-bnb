import path from 'path'
import fs from 'fs'

export default {
    // Auto discover components
    components: true,
    head: {
        titleTemplate: 'Mastering Nuxt: %s',
        htmlAttrs: {
            lang: 'en'
        },
        bodyAttrs: {
            class: ['my-style']
        },
        meta: [{
            charset: 'utf-8'
        }]
    },
    router: {
        prefetchLinks: false
    },
    server: {
        https: {
            key: fs.readFileSync(path.resolve('./sslCerts', 'key.pem')),
            cert: fs.readFileSync(path.resolve('./sslCerts', 'cert.pem'))
        }
    },
    plugins: [
        '~/plugins/axios.api',
        '~/plugins/maps.client',
        '~/plugins/auth.client',
        '~/plugins/imageHandler'
    ],
    modules: [
        '~/modules/api',
        '~/modules/payment'
    ],
    css: ['~/assets/sass/global.scss'],
    buildModules: [
        ['@nuxtjs/vuetify', {
            theme: {
                themes: {
                    light: {
                        primary: '#a15a20',
                        secondary: '#faefe3',
                        accent: '#3b210c',
                        error: '#b71c1c'
                    },
                    dark: {
                        primary: '#a15a20',
                        secondary: '#faefe3',
                        accent: '#3b210c',
                        error: '#b71c1c',
                        background: '#3b210c'
                    }
                },
                options: {
                    customProperties: true,
                    variations: false
                },
            },
            customVariables: ['~/assets/sass/variables.scss'],
            treeShake: true
        }]
    ],
    build: {
        extractCss: true,
        loaders: {
            limit: 0
        }
    },
    publicRuntimeConfig: {
        auth: {
            clientId: process.env.GOOGLE_AUTH_CLIENT_ID
        },
        map: {
            key: process.env.GOOGLE_MAPS_API_KEY
        },
        url: {
            app: `https://${process.env.HOST}:${process.env.NUXT_PORT}/`,
            api: `https://${process.env.HOST}:${process.env.NUXT_PORT}/api/`,
            payment: `https://${process.env.HOST}:${process.env.NUXT_PORT}/payment/`
        }
    },
    privateRuntimeConfig: {
        apiDb: {
            dbUrl: process.env.API_DB_URL,
            dbName: process.env.API_DB_NAME,
        },
        auth: {
            access_secret: process.env.ACCESS_SECRET,
            access_life: process.env.ACCESS_LIFE,
            refresh_secret: process.env.REFRESH_SECRET,
            refresh_cookie: process.env.REFRESH_COOKIE,
            refresh_life: process.env.REFRESH_LIFE,
        },
        smtp: {
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT
        },
        paymentDb: {
            dbUrl: process.env.PAYMENT_DB_URL,
            dbName: process.env.PAYMENT_DB_NAME,
        },
        razorpay: {
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        }
    }
}