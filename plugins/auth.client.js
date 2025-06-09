export default function({$config, $api, redirect, error}, inject) {
    let isLoaded = false
    let waiting = []

    window.handleCredentialResponse = parseUser

    addScript()
    inject('auth', {
        enableAuth,
        parseUser
    })

    function addScript() {
        const script = document.createElement('script')
        script.src = "https://accounts.google.com/gsi/client"
        script.async = true
        document.head.appendChild(script)
        script.addEventListener("load", () => {
            isLoaded = true
            waiting.forEach((item) => {
                if (typeof item.fn === 'function') {
                    item.fn(...item.arguments)
                }
            })
            waiting = []
        })
    }
    
    function enableAuth(canvas) {
        if (!isLoaded){
            waiting.push({
                fn: enableAuth,
                arguments
            })
            return
        }

        window.google.accounts.id.initialize({
            client_id: $config.auth.clientId,
            callback: window.handleCredentialResponse,
            context: "use",
            ux_mode: "popup",
            use_fedcm_for_prompt: true
        });

        window.google.accounts.id.renderButton(
            canvas,{
                type: "standard",
                shape: "rectangular",
                theme: "outline",
                size: "large",
                text: "signin",
                width: 100
            }  
        );

        parseUser()
    }

    async function parseUser(userDetails) {
        if (!isLoaded) {
            waiting.push({
                fn: parseUser,
                arguments
            })
            return
        }
        try {
            let user
            if (!userDetails) {
                user = await $api.$get('/users')
                if (!user) {
                    return
                }
            } else {
                const idToken = userDetails.credential
                const response = await $api.$post('/auth/google-auth', {
                    token: idToken
                })
                if (!response) {
                    error({ statusCode: 401, message: 'Google Sign-on Failed' })
                } 
                redirect('/')
            }

        } catch (error) {
            console.log(error)

        }
    }

}