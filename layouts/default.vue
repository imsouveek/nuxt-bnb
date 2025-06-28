<template>
    <v-app>
        <v-app-bar app absolute elevation="0" color="secondary">
            <v-container>
                <v-row justify="center">
                    <v-col cols="12" md="9">
                        <search-bar />
                    </v-col>
                </v-row>
            </v-container>
        </v-app-bar>
        <v-main>
            <v-container>
                <v-row justify="center">
                    <v-col cols="12" md="9">
                        <nuxt />
                    </v-col>
                </v-row>
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
export default {
    name: 'DefaultLayout'
}
</script>
