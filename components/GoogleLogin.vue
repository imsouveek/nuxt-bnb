<template>
    <div>
        <div ref="googleButton" style="display: none"></div>
        <v-btn color="primary" depressed block @click="googleLogin">
            <v-img src="/images/google.svg" max-height="20" max-width="20" contain style="filter: invert(1)" />
             &nbsp; &nbsp; {{ btnText }}
        </v-btn>
        <div class="divider py-4">
            &nbsp;or&nbsp;
        </div>
    </div>
</template>

<script>
export default {
    name: 'GoogleLogin',
    props: {
        btnText: {
            type: String,
            default: 'Sign In with Google'
        }
    },
    mounted () {
        this.$googleAuth.enableAuth(this.$refs.googleButton)
    },
    methods: {
        googleLogin () {
            this.$refs.googleButton.querySelector('div[role=button]').click()
        }
    }
}
</script>

<style lang="scss" scoped>
::v-deep.divider {
    display: flex;
    align-items: center;

    &::before,
    &::after {
        flex: 1;
        opacity: 0.3;
        content: '';
        padding: 1px;
        background-color: var(--v-accent-base);
        // margin: 1px;
    }
}
</style>
