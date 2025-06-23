export default function ({ $api, $config, redirect, store }, inject) {
    // window.handleCredentialResponse = parseUser
    inject('razorpay', {
        initPayment
    })

    function loadScript(src) {
        return new Promise((resolve) => {
            const script = document.createElement('script')
            script.src = src
            script.onload = () => {
                resolve(true)
            }
            script.onerror = () => {
                resolve(false)
            }
            document.body.appendChild(script)
        })
    }

    async function initPayment(bookingApiResponse) {
        console.log(bookingApiResponse)
        if (!store.state.auth.isLoggedIn) {
            throw new Error("User needs to be logged in to initiate payment")
        }
        const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')
        if (!res) {
            alert('Razorpay failed to load!!')
            return
        }

        const homeDetails = await $api.$get(`/search/homes/${bookingApiResponse.booking.home}?fieldList=title`)
        const title = homeDetails.title
        const bookingId = bookingApiResponse.booking._id
        const amount = bookingApiResponse.booking.totalAmount * 100
        const order_id = bookingApiResponse.gatewayRefs.gatewayRefOrderId
        const nights = bookingApiResponse.booking.endEpoch - bookingApiResponse.booking.startEpoch
        const name = store.state.auth.user.name
        const email = store.state.auth.user.email
        const contact = ''
        let error

        const options = {
            key: $config.razorpay.key_id,
            amount,
            currency: 'INR',
            name: 'NuxtBnb',
            description: `${title} booking for ${nights} nights`,
            image: `${$config.url.app}/images/logo.svg`,
            order_id,
            callback_url: `${$config.url.app}/booking/status?success=true&bookingId=${bookingId}`,
            prefill: {
                name,
                email,
                contact
            },
            theme: {
                color: '#3b210c'
            },
            modal: {
                ondismiss: async () => {
                    error = 'Payment exited'
                    try {
                        await $api.$patch(`/bookings/${bookingId}`, {
                            status: 'Failed'
                        })
                    } catch (err) {
                        error = err?.message
                    }
                    redirect(`/booking/status?success=false&error=${encodeURIComponent(error)}`)
                }
            }
        }

        const rzp = new window.Razorpay(options)
        rzp.on('payment.failed', function (response) {
            alert('Payment failed. Please try again.')
            console.error(response.error)
        })
        rzp.open()

    }
}