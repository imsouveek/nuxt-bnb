import axios from 'axios'
import csrfHelper from '../utils/csrfHelper.js'
import refreshHelper from '../utils/refreshHelper.js'
const { getCookie, extractCsrfToken, ensureCsrfReady } = csrfHelper
const { handleRefreshLogic } = refreshHelper

export default function ({ $config, store }, inject) {
    const instance = axios.create({
        baseURL: $config.url.api,
        withCredentials: true
    })

    instance.interceptors.request.use(async (config) => {
        console.log(`Making ${config.method} request to ${config.url}`)

        const { csrf_cookie, csrf_header } = $config.auth
        const method = config.method?.toLowerCase()
        const isUnsafe = !['get', 'head', 'options'].includes(method)

        if (isUnsafe && config.url !== '/csrf-token') {
            const res = await ensureCsrfReady(instance, csrf_cookie)

            const cookieHeader = res?.headers?.['set-cookie']
            const raw = getCookie(csrf_cookie, cookieHeader)
            const token = raw ? extractCsrfToken(raw) : null

            if (token) {
                config.headers[csrf_header] = token
            }
        }

        return config
    })

    instance.interceptors.response.use(
        (response) => {
            const { config, data } = response
            if (['/users/logout', '/users/logoutAll'].includes(config.url)) {
                store.commit('auth/user', null)
                delete instance.defaults.headers.common.Authorization
            }

            if (data?.access_token) {
                instance.defaults.headers.common.Authorization = `Bearer ${data.access_token}`
                if (!store.state.auth.isLoggedIn && data.user) {
                    store.commit('auth/user', { ...data.user })
                }
            }

            return response
        },

        async (error) => {
            const originalRequest = error.config

            if (typeof document === 'undefined') {
                return Promise.reject(error)
            }

            if (!error.response) {
                console.error(`Network error: ${error.message} for ${error.config?.url}`)
            }

            try {
                const newToken = await handleRefreshLogic(error, instance)
                if (newToken) {
                    originalRequest.headers.Authorization = `Bearer ${newToken}`
                    return instance(originalRequest)
                }
            } catch (refreshError) {
                return handleAuthError(refreshError)
            }

            return Promise.reject(error)
        }
    )

    function handleAuthError (err) {
        store.commit('auth/user', null)
        delete instance.defaults.headers.common.Authorization
        return Promise.reject(err)
    }

    const api = {
        $get: (...args) => instance.get(...args).then(r => r.data),
        $post: (...args) => instance.post(...args).then(r => r.data),
        $put: (...args) => instance.put(...args).then(r => r.data),
        $patch: (...args) => instance.patch(...args).then(r => r.data),
        $delete: (...args) => instance.delete(...args).then(r => r.data),
        $request: (...args) => instance.request(...args).then(r => r.data),
        raw: instance // expose raw Axios instance if needed
    }

    inject('api', api)
}
