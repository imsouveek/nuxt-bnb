export default async function ({ $api, store, route, redirect }) {
    let user
    const authStore = store.state.auth

    if (authStore.isLoggedIn) {
        user = authStore.user
    }

    if (!user && route.meta.some(m => m.authRequired)) {
        try {
            user = await $api.$get('/users')
        } catch (err) {
            store.commit('auth/setRedirectUrl', route?.fullPath)
            return redirect('/auth/login')
        }
    }
}