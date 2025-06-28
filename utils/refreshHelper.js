let refreshPromise = null
const refreshDenylist = ['/auth/login', '/auth/google-auth', '/auth/refresh']

function handleRefreshLogic (error, instance) {
    const originalRequest = error.config

    if (
        error.response?.status !== 401 ||
        originalRequest._retry ||
        refreshDenylist.includes(originalRequest.url)
    ) {
        return null
    }

    originalRequest._retry = true

    if (!refreshPromise) {
        refreshPromise = instance.post('/auth/refresh', {})
            .then((res) => {
                refreshPromise = null
                const token = res.data?.access_token
                if (!token) {
                    throw new Error('No access token in refresh response')
                }

                instance.defaults.headers.common.Authorization = `Bearer ${token}`
                return token
            })
            .catch((err) => {
                refreshPromise = null
                throw err
            })
    }

    return refreshPromise
}

export default {
    handleRefreshLogic
}
