<template>
    <div>
        <div class="px-16">
            <v-card flat>
                <v-card-title>Sign Up Now</v-card-title>
                <v-card-text>
                    <span v-if="!!message" class="text-h6 error--text d-flex flex-row justify-center">{{ message
                        }}</span>
                    <span v-else>
                        <google-login btn-text="Sign Up with Google" />
                        <v-form ref="form" @submit.prevent="submitHandler">
                            <v-text-field
                                v-model="name" outlined dense clearable label="Name" persistent-placeholder
                                placeholder="John Doe" required :rules="nameRules"
                            />
                            <v-text-field
                                v-model="email" outlined dense clearable label="Email Address"
                                persistent-placeholder placeholder="email@domain.com" required :rules="emailRules"
                            />
                            <v-text-field
                                v-model="password" outlined dense clearable type="password" label="Password"
                                password persistent-placeholder placeholder="......" required
                                :rules="passwordRules"
                            />
                            <v-text-field
                                v-model="confirm" outlined dense clearable type="password" label="Re-enter Password"
                                password persistent-placeholder placeholder="......" required
                                :rules="confirmRules"
                            />
                            <v-btn color="primary" depressed block type="submit">Sign Up</v-btn>
                        </v-form>
                    </span>
                </v-card-text>
            </v-card>
        </div>
        <span v-if="!message">
            Already have an account? &nbsp;
            <nuxt-link to="/auth/login">Log In</nuxt-link>
        </span>
        <nuxt-link v-if="!!message" to="/auth/login">
            Back to Login
        </nuxt-link>
    </div>
</template>

<script>
import validator from 'validator'

export default {
    name: 'UserRegistration',
    data: () => ({
        name: '',
        nameRules: [
            v => !!v || 'Name is required'
        ],
        email: '',
        emailRules: [
            v => !!v || 'E-mail is required',
            v => validator.isEmail(v) || 'E-mail must be valid'
        ],
        password: '',
        passwordRules: [
            v => !!v || 'Password is required',
            v => /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/.test(v) || 'Password must contain at least lowercase letter, one number, a special character and one uppercase letter'
        ],
        confirm: '',
        message: ''
    }),
    computed: {
        confirmRules () {
            const rules = []
            const requiredRule = v => !!v || 'Password confirm is required'
            rules.push(requiredRule)

            const matchRule =
            v => (!!v && v) === this.password || 'Password values do not match'
            rules.push(matchRule)

            return rules
        }
    },
    methods: {
        submitHandler: async function () {
            if (!this.$refs.form.validate()) {
                return
            }
            try {
                const resp = await this.$api.$post('/users', {
                    name: this.name,
                    email: this.email,
                    password: this.password
                })
                if (!resp) {
                    throw new Error('User Registration Failed. Please try again later')
                }
            } catch (error) {
                this.$nuxt.context.error({ statusCode: 500, message: error.message })
            }

            this.message = 'User sign-up successful. Please log in'
        }
    }
}
</script>
