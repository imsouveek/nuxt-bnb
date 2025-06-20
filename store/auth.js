export const state = () => ({
    isLoggedIn: false,
    user: {},
    redirectUrl: null
})

export const mutations = {
    user(state, user) {
        state.isLoggedIn = !!user
        state.user = user || {}
    },
    setRedirectUrl(state, fullPath) {
        state.redirectUrl = fullPath
    }
}