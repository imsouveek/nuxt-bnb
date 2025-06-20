<template>
    <div>
        <v-container>
            <v-row no-gutters>
                <v-col cols="3">
                    <v-card light height="95vh" class="mr-4">
                        <v-list>
                            <v-list-item>
                                <v-list-item-avatar size="120">
                                    <v-img :src="$imageHandler.get(user.image, 200, 200)" />
                                </v-list-item-avatar>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title class="text-h6">
                                        {{ user.name }}
                                    </v-list-item-title>
                                    <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                        <v-divider></v-divider>
                        <v-list nav dense>
                            <v-list-item v-for="(item, i) in items" :key="i">
                                <v-btn :to="item.path" text color="primary" block class="d-flex justify-start">
                                    <v-icon class="mr-4">{{ item.icon }}</v-icon>
                                    {{ item.title }}
                                </v-btn>
                            </v-list-item>
                        </v-list>
                    </v-card>
                </v-col><v-col cols="9">
                    <v-main>
                        <v-card light height="95vh" class="overflow-auto pa-2">
                            <nuxt-child />
                        </v-card>
                    </v-main>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
export default {
    name: 'AdminHomePage',
    layout: 'blank',
    meta: {
        authRequired: true
    },
    async asyncData( {store, error} ) {
        if (!store.state.auth.isLoggedIn) {
                error( {statusCode: 401, message: "No Access!! Please log in!"})
        }
    
    },
    data() {
        return {
            items: [
                { title: 'Homes', icon: 'mdi-home', path: "/admin/home" },
                { title: 'Profile', icon: 'mdi-account', path: "/admin/profile" },
                { title: 'Help', icon: 'mdi-help-box', path: "/admin/help" },
                { title: 'Exit', icon: 'mdi-exit-to-app', path: "/" },
            ],
            right: null,
        }
    },
    head() {
        return {
            title: 'Admin'
        }
    },
    computed: {
        user() {
            return this.$store.state.auth.user
        }
    },
    mounted() {
        this.$vuetify.theme.dark = true
    },
    destroyed() {
        this.$vuetify.theme.dark = false
    }
}
</script>


