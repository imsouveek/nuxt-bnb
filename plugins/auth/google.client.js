import redirectAfterLogin from '../../utils/redirectAfterLogin.js'
export default function ({ app, $config, $api, store, error }, inject) {
    let isLoaded = false
    let waiting = []

    window.handleCredentialResponse = parseUser

    addScript()
    inject('googleAuth', {
        enableAuth,
        parseUser
    })

    function addScript () {
        const script = document.createElement('script')
        script.src = 'https://accounts.google.com/gsi/client'
        script.async = true
        document.head.appendChild(script)
        script.addEventListener('load', () => {
            isLoaded = true
            waiting.forEach((item) => {
                if (typeof item.fn === 'function') {
                    item.fn(...item.arguments)
                }
            })
            waiting = []
        })
    }

    function enableAuth (canvas) {
        if (!isLoaded) {
            waiting.push({
                fn: enableAuth,
                arguments
            })
            return
        }

        window.google.accounts.id.initialize({
            client_id: $config.auth.clientId,
            callback: window.handleCredentialResponse,
            context: 'use',
            ux_mode: 'popup',
            use_fedcm_for_prompt: true
        })

        window.google.accounts.id.renderButton(
            canvas, {
                type: 'standard',
                shape: 'rectangular',
                theme: 'outline',
                size: 'large',
                text: 'signin',
                width: 100
            }
        )
    }

    async function parseUser (userDetails) {
        if (!isLoaded) {
            waiting.push({
                fn: parseUser,
                arguments
            })
            return
        }
        try {
            const idToken = userDetails.credential
            const response = await $api.$post('/auth/google-auth', {
                token: idToken
            })
            if (!response) {
                error({ statusCode: 401, message: 'Google Sign-on Failed' })
            }
            redirectAfterLogin(store, app.router)
        } catch (error) {
            console.log(error)
        }
    }
}
