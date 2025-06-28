export default ({ $api, store }, inject) => {
    inject('initSession', async () => {
        if (store.state.auth.isLoggedIn) {
            return
        }
        try {
            await $api.$get('/users')
        } catch (err) {
            console.log('Could not login user')
        }
    })
}
