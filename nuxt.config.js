import path from 'path'
import fs from 'fs'

const isRender = process.env.RENDER === 'true'
const baseUrl = isRender
  ? 'https://nuxt-bnb.onrender.com'
  : `https://${process.env.HOST || 'localhost'}:${process.env.NUXT_LOCAL_PORT}`

let httpsConfig
try {
    httpsConfig = {
        key: fs.readFileSync(path.resolve('./sslCerts', 'key.pem')),
        cert: fs.readFileSync(path.resolve('./sslCerts', 'cert.pem'))
    }
    console.log('✅ HTTPS config loaded')
} catch (e) {
    console.log('❌ Failed to load HTTPS certs:', e.message)
}

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
        meta: [
            { charset: 'utf-8' },
            {
                name: 'google-site-verification',
                content: 'YgPqOgbselqoFP2C_c5m19a90PH7ag6AnhHQ24RqXa0'
            }
        ]
    },
    router: {
        prefetchLinks: false,
        middleware: 'auth'
    },
    server: {
        port: process.env.PORT || process.env.NUXT_PORT,
        host: isRender ? '0.0.0.0' : process.env.NUXT_HOST,
        ...(isRender ? {} : { https: httpsConfig })
    },
    plugins: [
        '~/plugins/axios.api',
        '~/plugins/auth/google.client',
        '~/plugins/paymentGateway/razorpay.client',
        '~/plugins/maps.client',
        '~/plugins/imageHandler',
        '~/plugins/initSession.client'
    ],
    modules: ['~/modules/api', '~/modules/payment', '~/modules/noSSR'],
    css: ['~/assets/sass/global.scss'],
    buildModules: [
        [
            '@nuxtjs/vuetify',
            {
                theme: {
                    themes: {
                        light: {
                            primary: '#a15a20',
                            secondary: '#faefe3',
                            accent: '#3b210c',
                            error: '#b71c1c',
                            success: '#228b22'
                        },
                        dark: {
                            primary: '#a15a20',
                            secondary: '#faefe3',
                            accent: '#3b210c',
                            error: '#b71c1c',
                            success: '#228b22',
                            background: '#3b210c'
                        }
                    },
                    options: {
                        customProperties: true,
                        variations: false
                    }
                },
                customVariables: ['~/assets/sass/variables.scss'],
                treeShake: true
            }
        ]
    ],
    build: {
        extractCss: true,
        loaders: {
            limit: 0
        }
    },
    publicRuntimeConfig: {
        auth: {
            clientId: process.env.GOOGLE_AUTH_CLIENT_ID,
            csrf_cookie: process.env.CSRF_COOKIE,
            csrf_header: process.env.CSRF_HEADER,
            skip_cors: process.env.CODESPACES || false
        },
        map: {
            key: process.env.GOOGLE_MAPS_API_KEY
        },
        razorpay: {
            key_id: process.env.RAZORPAY_KEY_ID
        },
        url: {
            local: baseUrl,
            app: baseUrl,
            api: `${baseUrl}/api`,
            payment: `${baseUrl}/payment`
        }
    },
    privateRuntimeConfig: {
        apiDb: {
            dbUrl: process.env.API_DB_URL,
            dbName: process.env.API_DB_NAME
        },
        auth: {
            access_secret: process.env.ACCESS_SECRET,
            access_life: process.env.ACCESS_LIFE,
            refresh_secret: process.env.REFRESH_SECRET,
            refresh_cookie: process.env.REFRESH_COOKIE,
            refresh_life: process.env.REFRESH_LIFE,
            csrf_secret: process.env.CSRF_SECRET,
            csrf_life: process.env.CSRF_LIFE,
            password_token_expiry: process.env.PASSWORD_TOKEN_EXPIRY,
            image_token_expiry: process.env.IMAGE_TOKEN_EXPIRY
        },
        paymentAuth: {
            auth_header: process.env.PAYMENT_AUTH_HEADER,
            auth_key: process.env.PAYMENT_AUTH_KEY
        },
        paymentDb: {
            dbUrl: process.env.PAYMENT_DB_URL,
            dbName: process.env.PAYMENT_DB_NAME
        },
        razorpay: {
            key_secret: process.env.RAZORPAY_KEY_SECRET,
            webhook_secret: process.env.WEBHOOK_SECRET
        },
        smtp: {
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT
        }
    }
}
