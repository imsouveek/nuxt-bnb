let csrfInitPromise = null

export function getCookie(name) {
    return document.cookie
        .split('; ')
        .find(c => c.startsWith(name + '='))
        ?.split('=')[1]
}

export function extractCsrfToken(raw) {
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

export async function ensureCsrfReady(instance, cookieName) {
    if (getCookie(cookieName)) return
    if (!csrfInitPromise) {
        csrfInitPromise = instance.post('/csrf-token')
            .catch((e) => {
                csrfInitPromise = null // reset on failure
                throw e
            })
    }
    await csrfInitPromise
}
