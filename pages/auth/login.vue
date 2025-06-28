<template>
    <div>
        <div class="px-16">
            <v-card flat>
                <v-card-title>Log In</v-card-title>
                <v-card-text>
                    <span v-if="!!message" class="text-h6 error--text mb-4 d-flex flex-row justify-center">{{ message
                        }}</span>
                    <google-login btn-text="Sign In with Google" />
                    <v-form @submit.prevent="submitHandler">
                        <v-text-field
                            v-model="email" outlined dense clearable label="Email Address"
                            persistent-placeholder placeholder="email@domain.com"
                        />
                        <v-text-field
                            v-model="password" outlined dense clearable type="password" label="Password"
                            password persistent-placeholder placeholder="......"
                        />
                        <v-btn color="primary" depressed block type="submit">
                            Log In
                        </v-btn>
                    </v-form>
                    <div class="d-flex flex-row-reverse">
                        <nuxt-link to="/auth/forgot">
                            Forgot Password
                        </nuxt-link>
                    </div>
                </v-card-text>
            </v-card>
        </div>
        Don't have an account? &nbsp;
        <nuxt-link to="/auth/register">
            Sign Up
        </nuxt-link>
    </div>
</template>

<script>
import redirectAfterLogin from '../../utils/redirectAfterLogin.js'
export default {
    name: 'UserLogin',
    data: () => ({
        email: '',
        password: '',
        message: ''
    }),
    methods: {
        googleLogin () {
            this.$refs.googleButton.querySelector('div[role=button]').click()
        },
        submitHandler: async function () {
            try {
                const resp = await this.$api.$post('/auth/login', {
                    email: this.email,
                    password: this.password
                })
                if (!resp) {
                    throw new Error('Invalid email or password')
                }

                redirectAfterLogin(this.$store, this.$router)
            } catch (error) {
                this.message = error.message
            }
        }
    }
}
</script>
