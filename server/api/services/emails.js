import { createTransport } from 'nodemailer'

export default (smtp, appUrl) => {
    const transporter = createTransport({
        host: smtp.host,
        port: smtp.port
    })

    async function sendForgottenPasswordEmail (reset) {
        const url = `${appUrl}/auth/reset/${reset.token}`

        await transporter.sendMail({
            from: 'info@nuxtbnb.com',
            to: reset.email,
            subject: 'Reset your password',
            html: `Click <a href="${url}">here</a> to reset your password`
        })
    }

    return {
        sendForgottenPasswordEmail
    }
}
