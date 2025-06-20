export default ({ $api }, inject) => {
    inject('initSession', async () => {
        try {
            await $api.$get('/users')
        } catch (err) {
            console.log("Could not login user")
        }
    })
}