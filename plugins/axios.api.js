import axios from 'axios'

export default function ({ $config, store }, inject) {

    const instance = axios.create({
        baseURL: $config.url.api,
        https: true
    })

    instance.interceptors.request.use((config) => {
        console.log(`Making request to ${config.url}`)
        return config
    })

    instance.interceptors.response.use(
        async (response) => {
            const { config, data } = response
            if (['/users/logout', '/users/logoutAll'].includes(config.url)) {
                store.commit('auth/user', null)
                delete instance.defaults.headers.common["Authorization"]
            }

            if (data?.access_token) {
                instance.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`
                if (!store.state.auth.isLoggedIn && data.user) {
                    store.commit('auth/user', { ...data.user })
                }
            }

            return response
        },

        async (error) => {
            const originalRequest = error.config

            if (error.response?.status === 401 && !originalRequest._retry) {
                const shouldAttemptRefresh = !['/auth/login', '/auth/google-auth', '/auth/refresh'].includes(originalRequest.url)
                if (shouldAttemptRefresh) {
                    originalRequest._retry = true
                    try {
                        const res = await instance.post('/auth/refresh', {}, { withCredentials: true })
                        if (res.status !== 200 || !res.data?.access_token) {
                            return handleAuthError(error)
                        }

                        const newToken = res.data.access_token

                        instance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
                        originalRequest.headers['Authorization'] = `Bearer ${newToken}`
                        return instance(originalRequest)
                    } catch (refreshError) {
                        return handleAuthError(refreshError)
                    }
                }
            }

            return Promise.reject(error)
        }
    )

    function handleAuthError(err) {
        store.commit('auth/user', null)
        delete instance.defaults.headers.common['Authorization']
        return Promise.reject(err)
    }

    const api = {
        $get: (...args) => instance.get(...args).then(r => r.data),
        $post: (...args) => instance.post(...args).then(r => r.data),
        $put: (...args) => instance.put(...args).then(r => r.data),
        $delete: (...args) => instance.delete(...args).then(r => r.data),
        $request: (...args) => instance.request(...args).then(r => r.data),
        raw: instance, // expose raw Axios instance if needed
    }

    inject('api', api)
}