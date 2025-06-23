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
    name: 'AuthPage',
    layout: 'blank',

    async asyncData( {from, store} ) {
        if(! store.state.auth.redirectUrl) {
            store.commit('auth/setRedirectUrl', from?.fullPath)
        }
    },

     head() {
        return {
            title: 'Auth'
        }
    },

    beforeDestroy() {
        this.$store.commit('auth/setRedirectUrl', null)
    }
}
</script>

<style lang="scss" scoped>
::v-deep.full-width {
    width: 100%;
}

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