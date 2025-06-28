export default ({ $api }, inject) => {
    // To inject $xyz(...) just use syntax as follows:
    // inject ('xyz', () => {...})

    inject('imageHandler', {
        get,
        read,
        put,
        remove
    })

    function get (id, options = {}) {
        let imageParams
        const keys = Object.keys(options)
        const str = keys.reduce((result, item) => {
            result += item + '=' + options[item] + '&'
            return result
        }, '?')
        if (keys.length === 0) {
            imageParams = ''
        } else {
            imageParams = str.substring(0, str.length - 1)
        }

        if (id) {
            return `/api/images/${id}${imageParams}`
        } else {
            return ''
        }
    }

    function read (file) {
        return new Promise((resolve) => {
            if (!file) {
                resolve('')
            }

            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result)
            reader.readAsDataURL(file)
        })
    }

    async function put (str) {
        if (!str) {
            return ''
        }

        // Step 1: Generate upload token
        const tokenResponse = await $api.$post('/users/token', {
            type: 'image'
        })
        const uploadToken = tokenResponse.token.token

        // Step 2: Upload image with token in headers
        const res = await $api.$post('/images', {
            data: str
        }, {
            headers: {
                'upload-token': uploadToken
            }
        })

        return { id: res.id }
    }

    async function remove (id) {
        if (!id) {
            return
        }

        // Step 1: Generate delete token (same endpoint)
        const tokenResponse = await $api.$post('/users/token', {
            type: 'image'
        })
        const uploadToken = tokenResponse.token.token

        // Step 2: Send DELETE with token in headers
        const res = await $api.$delete(`/images/${id}`, {
            headers: {
                'upload-token': uploadToken
            }
        })

        return res
    }
}
