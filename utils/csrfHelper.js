let csrfInitPromise = null

function getCookie (name, cookieSource) {
    if (!cookieSource) {
        if (typeof document === 'undefined') {
            return null
        }
        cookieSource = document.cookie
    }

    let cookies = []

    if (Array.isArray(cookieSource)) {
        cookies = cookieSource
    } else if (typeof cookieSource === 'string') {
        cookies = cookieSource.split('; ')
    } else {
        return null
    }

    const match = cookies.find(c => c.startsWith(name + '='))

    if (!match) {
        return null
    }

    const value = match.split('=')[1]
    return value
}

function extractCsrfToken (raw) {
    try {
        const dot = raw.lastIndexOf('.')
        const payload = decodeURIComponent(raw.slice(0, dot))
        const parsed = JSON.parse(payload)
        return parsed.token
    } catch (e) {
        console.warn('CSRF cookie is invalid or corrupted:', e)
        return null
    }
}

async function ensureCsrfReady (instance, cookieName) {
    if (getCookie(cookieName)) {
        return
    }
    if (!csrfInitPromise) {
        csrfInitPromise = instance.post('/csrf-token')
            .catch((e) => {
                csrfInitPromise = null // reset on failure
                throw e
            })
    }
    return await csrfInitPromise
}

export default {
    getCookie,
    extractCsrfToken,
    ensureCsrfReady
}
