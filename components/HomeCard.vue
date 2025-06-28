<template>
    <v-card class="home-card my-12 mx-auto" hover nuxt color="secondary" :max-width="getWidth">
        <v-container>
            <v-row>
                <v-col :cols="horizontal ? 6 : 12" class="pa-0">
                    <v-img
                        :height="horizontal ? '100%' : '300'" :src="$imageHandler.get(home.images[0])"
                        :class="horizontal ? 'left-rounded' : 'top-rounded'"
                    />
                    <v-btn absolute top left fab dark small color="secondary" class="favicon">
                        <v-icon color="primary">
                            mdi-heart-outline
                        </v-icon>
                    </v-btn>
                </v-col>
                <v-col :cols="horizontal ? 6 : 12" class="pa-0">
                    <div class="text-h5 pa-4">
                        {{ home.title }}
                    </div>
                    <v-card-text>
                        <v-row class="mx-0 d-flex">
                            <v-rating
                                :value="home.reviewValue" color="primary" dense half-increments readonly size="14"
                                class="align-self-center"
                            />
                            <div class="ms-4 align-self-center text--secondary">
                                {{ home.reviewValue }} ({{ home.reviewCount }})
                            </div>
                        </v-row>
                        <div class="my-4 text-subtitle-1">
                            {{ home.guests }} guests &middot; ${{ home.pricePerNight }} / night
                        </div>
                        <div>
                            <v-icon color="primary">
                                mdi-map-marker-outline
                            </v-icon>
                            <span class="primary--text text-decoration-underline">
                                {{ home.location.address }}, {{ home.location.city }}, {{ home.location.state }}
                            </span>
                        </div>
                        <div v-if="showExtraDetails">
                            <v-divider class="my-4" />
                            <p class="my-0">
                                {{ pluralize(home.guests, "guest") }} &middot;
                                {{ pluralize(home.bedrooms, "room") }} &middot;
                                {{ pluralize(home.beds, "bed") }} &middot;
                                {{ pluralize(home.bathrooms, "bath") }}
                            </p>
                            <p>
                                {{ features }}
                            </p>
                        </div>
                    </v-card-text>
                </v-col>
            </v-row>
        </v-container>
    </v-card>
</template>

<script>
import pluralize from '~/utils/pluralize'

export default {
    name: 'HomeCard',
    props: {
        showExtraDetails: {
            type: Boolean,
            default: false
        },
        horizontal: {
            type: Boolean,
            default: false
        },
        home: {
            type: Object,
            required: true
        }
    },
    computed: {
        getWidth () {
            if (!this.horizontal) {
                return '350'
            }
            return ''
        },
        features () {
            return this.home.features.slice(0, 3).join(', ')
        }
    },
    methods: {
        pluralize
    }
}
</script>

<style lang="scss" scoped>
@import '~vuetify/src/components/VCard/_variables.scss';
::v-deep.home-card:hover {
    background-color: $white !important;
}

::v-deep.left-rounded {
    border-radius: $card-border-radius 0 0 $card-border-radius;
}

::v-deep.top-rounded {
    border-radius: $card-border-radius $card-border-radius 0 0;
}

::v-deep.favicon {
    top: 15px !important;
}
</style>
