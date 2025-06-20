<template>
    <v-app>
        <v-app-bar app absolute elevation="0" color="secondary">
            <v-container style="max-width: 80%;">
                <v-row class="align-center mx-auto">
                    <v-col cols="2" class="pl-0">
                        <nuxt-link to="/">
                            <img src="/images/logo.svg" height="45" />
                        </nuxt-link>
                    </v-col>
                    <v-col cols="4">
                        <app-bar-input v-model="inputText" input-id="citySearch" @changed="locationChanged" />
                    </v-col>
                    <v-col cols="3">
                        <date-range-picker v-model="dates"/>
                    </v-col>
                    <v-col cols="1">
                        <v-btn color="primary" depressed @click="submitSearch">
                            <v-icon>mdi-magnify</v-icon>
                        </v-btn>
                    </v-col>
                    <v-col cols="2" class="d-flex pr-0">
                        <v-spacer />
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
                            <div v-show="!isLoggedIn">
                                <v-btn color="primary" depressed to="/auth/login">
                                    &nbsp; &nbsp;Sign In
                                </v-btn>
                            </div>
                        </div>
                    </v-col>
                </v-row>
            </v-container>
        </v-app-bar>
        <v-main>
            <v-container style="max-width: 80%;">
                <nuxt />
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
import { ISODate, addDays, toEpochDate } from '~/utils/dateUtils';

export default {
    name: 'DefaultLayout',
    data: () => ({
        dates: [ISODate(addDays(Date.now(), 7)), ISODate(addDays(Date.now(), 9))],
        inputText: '',
        place: null
    }),
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
        this.$maps.makeAutoComplete(document.getElementById("citySearch"))
    },
    methods: {
        locationChanged(event) {
            this.place = event.detail
        },
        submitSearch() {
            if (!this.place || !this.dates[1]) return
            this.$router.push({
                name: "search",
                query: {
                    lat: this.place.geometry.location.lat(),
                    lng: this.place.geometry.location.lng(),
                    label: this.place.formatted_address || this.place.name,
                    startEpoch: toEpochDate(this.dates[0]),
                    endEpoch: toEpochDate(this.dates[1])
                }
            })
        },
        async logoutHandler() {
            await this.$api.$post('/users/logout')
        }
    }
}
</script>