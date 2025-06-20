export default function redirectAfterLogin(store, router) {
    const redirectUrl = store.state.auth.redirectUrl
    if (redirectUrl) {
        store.commit('auth/setRedirectUrl', null)
        router.replace(redirectUrl)
    } else {
        router.push('/')
    }
}