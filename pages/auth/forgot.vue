<template>
    <div>
        <div class="px-16">
            <v-card flat>
                <v-card-title>Forgot Password</v-card-title>
                <v-card-text>
                    <div v-if="!!message" class="text-h6 error--text mb-4 d-flex flex-row justify-center">
                        {{ message }}
                    </div>
                    <v-form v-else ref="form" @submit.prevent="submitHandler">
                        <v-text-field
v-model="email" outlined dense clearable label="Email Address"
                            persistent-placeholder placeholder="email@domain.com" :rules="emailRules" required />
                        <v-btn color="primary" depressed block type="submit">Send Reset Link</v-btn>
                    </v-form>
                </v-card-text>
            </v-card>
        </div>
        <nuxt-link to="/auth/login">Back to Login</nuxt-link>
    </div>
</template>

<script>
import validator from 'validator'

export default {
    name: 'ForgotPassword',
    data: () =>({
        email: '',
        emailRules: [
            v => !!v || 'E-mail is required',
            v => validator.isEmail(v) || 'E-mail must be valid',
        ],
        message: ''
    }),
    methods: {
        submitHandler: async function() {
            if (!this.$refs.form.validate()) {
                return
            }
            try {
                const resp = await this.$api.$post('/auth/forgot', {
                    email: this.email
                })
                if (!resp) {
                    throw new Error("Please try again later")
                }
                this.message = resp.message
            } catch (error) {
                this.$nuxt.context.error( {statusCode: 500, message: error.message})
            }
        }
    }
}
</script>