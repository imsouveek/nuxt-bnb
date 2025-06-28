<template>
    <v-container>
        <v-row class="align-center" justify="center">
            <v-col v-if="showLogo" :cols="showLogo? 4: 0" :md="showLogo? 2: 0" class="pl-0">
                <nuxt-link to="/">
                    <img src="/images/logo.svg" height="45" />
                </nuxt-link>
            </v-col>
            <v-col cols="12" :md="showLogo? 4: 6">
                <app-bar-input v-model="inputText" input-id="citySearch" @changed="locationChanged" />
            </v-col>
            <v-col cols="12" :md="showSignOn? 3: 5">
                <date-range-picker v-model="dates" @change="$emit('change', dates)" />
            </v-col>
            <v-col cols="4" md="1">
                <v-btn block color="primary" depressed @click="submitSearch">
                    <v-icon>mdi-magnify</v-icon>
                </v-btn>
            </v-col>
            <v-col v-if="showSignOn" :cols="showSignOn? 12: 0" :md="showSignOn? 2: 0" class="d-flex pr-0">
                <v-spacer />
                <sign-on-button />
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { ISODate, addDays, toEpochDate, fromEpochDate } from '~/utils/dateUtils'

export default {
    name: 'ConfigurableSearchBar',
    props: {
        showLogo: {
            type: Boolean,
            default: true
        },
        showSignOn: {
            type: Boolean,
            default: true
        }
    },
    data: () => ({
        dates: [ISODate(addDays(Date.now(), 7)), ISODate(addDays(Date.now(), 9))],
        inputText: '',
        place: null
    }),
    mounted () {
        this.$maps.makeAutoComplete(document.getElementById('citySearch'))

        if (this.$route.query?.startEpoch && this.$route.query?.endEpoch) {
            this.$set(this.dates, 0, fromEpochDate(this.$route.query.startEpoch))
            this.$set(this.dates, 1, fromEpochDate(this.$route.query.endEpoch))
        }

        this.inputText = this.$route.query.label
    },
    methods: {
        locationChanged (event) {
            this.place = event.detail
        },
        submitSearch () {
            if (!this.place || !this.dates[1]) {
                return
            }
            this.$router.push({
                name: 'search',
                query: {
                    lat: this.place.geometry.location.lat(),
                    lng: this.place.geometry.location.lng(),
                    label: this.place.formatted_address || this.place.name,
                    startEpoch: toEpochDate(this.dates[0]),
                    endEpoch: toEpochDate(this.dates[1])
                }
            })
        }
    }
}
</script>
