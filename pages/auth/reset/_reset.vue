<template>
    <div>
    <div class="px-16">
        <v-card flat>
            <v-card-title>Reset your password</v-card-title>
            <v-card-text>
                <div v-if="!!message" class="text-h6 mb-4 d-flex flex-row justify-center">
                    {{ message }}
                </div>
                <v-form v-else ref="form" @submit.prevent="submitHandler">
                    <v-text-field
                        v-model="password" outlined dense clearable type="password" label="Password"
                        password persistent-placeholder placeholder="......" required :rules="passwordRules"
                    />
                    <v-text-field
                        v-model="confirm" outlined dense clearable type="password" label="Re-enter Password"
                        password persistent-placeholder placeholder="......" required :rules="confirmRules"
                    />
                    <v-btn color="primary" depressed block type="submit">
                        Reset Password
                    </v-btn>
                </v-form>
            </v-card-text>
        </v-card>
    </div>
    <nuxt-link v-if="!!message" to="/auth/login">
        Back to Login
    </nuxt-link>
</div>
</template>

<script>
export default {
    name: 'PasswordReset',
    data: () => ({
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
                const resp = await this.$api.$post('/auth/reset', {
                    password: this.password,
                    token: this.$route.params.reset
                })
                if (!resp) {
                    throw new Error('Password Reset Failed')
                }
                this.message = 'Password reset successfully'
            } catch (error) {
                return this.$nuxt.context.error({ statusCode: 500, message: error.message })
            }
        }
    }
}
</script>
