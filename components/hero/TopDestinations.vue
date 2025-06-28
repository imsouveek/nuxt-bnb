<template>
    <v-container>
        <v-row>
            <v-spacer />
            <v-col cols="12" md="9">
                <v-card flat color="transparent">
                    <v-card-title>Top Destinations</v-card-title>
                    <v-row>
                        <v-col
                            v-for="(place, i) in topDestinations"
                            :key="i"
                            cols="6"
                            md="3"
                        >
                            <nuxt-link
                                :to="{
                                    name: 'search',
                                    query: {
                                        lat: place.lat,
                                        lng: place.lng,
                                        label: place.label,
                                        startEpoch: toEpochDate(linkDates[0]),
                                        endEpoch: toEpochDate(linkDates[1]),
                                    },
                                }"
                            >
                                <v-hover v-slot="{ hover }" open-delay="0" close-delay="0">
                                    <v-card
                                        light
                                        :elevation="hover ? 8 : 2"
                                        class="transition-swing overflow-hidden"
                                    >
                                        <v-img :src="place.image" height="250px" class="align-end">
                                            <v-overlay absolute color="primary" opacity="0.7" :value="hover" />
                                        </v-img>
                                            <v-card-title class="justify-center text-center primary--text z-index-1">
                                                {{ place.name }}
                                            </v-card-title>
                                    </v-card>
                                </v-hover>
                            </nuxt-link>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
            <v-spacer />
        </v-row>
    </v-container>
</template>

<script>
import { toEpochDate } from '~/utils/dateUtils'

export default {
    name: 'TopDestinations',
    props: {
        topDestinations: {
            type: Array,
            required: true
        },
        linkDates: {
            type: Array,
            required: true
        }
    },
    methods: {
        toEpochDate
    }
}
</script>
