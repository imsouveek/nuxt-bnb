<template>
    <div>
        <div v-if="isLoggedIn">
            <v-menu bottom left offset-y>
                <template #activator="{ on, attrs }">
                    <v-avatar v-bind="attrs" v-on="on">
                        <v-img
:src="$imageHandler.get(user.image, {
                            width: 200,
                            height: 200,
                            fit: 'cover'
                        })" class="avatar" />
                    </v-avatar>
                </template>
                <v-list width="250px">
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title class="text-h6 text-right">
                                {{ user.name }}
                            </v-list-item-title>
                            <v-list-item-subtitle class="text-right">{{ user.email
                                }}</v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                    <v-divider />
                    <v-list-item>
                        <v-list-item-title>
                            <v-btn
color="primary" class="d-flex justify-end" block text nuxt
                                to="/admin">
                                Admin Section
                            </v-btn>
                        </v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-title>
                            <v-btn
color="primary" class="d-flex justify-end" block text
                                @click="logoutHandler">
                                Sign Out
                            </v-btn>
                        </v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </div>
        <div v-else>
            <v-btn color="primary" depressed to="/auth/login">
                &nbsp; &nbsp;Sign In
            </v-btn>
        </div>
    </div>
</template>

<script>
export default {
    name: "SignOnButton",
    props: {
        absolute: Boolean
    },
    computed: {
        user() {
            return this.$store.state.auth.user
        },
        isLoggedIn() {
            return this.$store.state.auth.isLoggedIn
        }
    },
    async mounted() {
        await this.$initSession()
    },
    methods: {
        async logoutHandler() {
            await this.$api.$post('/users/logout')
        }
    }
}
</script>