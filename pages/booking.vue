<template>
    <v-main>
        <v-container fluid fill-height secondary>
            <v-layout align-center justify-center>
                <v-flex xs12 sm8 md4>
                    <v-card flat outlined>
                        <v-img src="/images/logo.svg" contain width="150" />
                        <v-card-text>
                            <nuxt-child/>
                        </v-card-text>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
    </v-main>
</template>

<script>
export default {
    name: 'BookingPage',
    layout: 'blank',
    meta: {
        authRequired: true
    },
    async asyncData({ store, error }) {
        if (!store.state.auth.isLoggedIn) {
                error( {statusCode: 401, message: "No Access!! Please log in!"})
        }
    }
}
</script>