<template>
    <div>
        <v-card class="px-2" flat>
            <v-container>
                <v-row>
                    <v-col cols="7" class="pl-0 pr-14 align-self-center">
                        <div class="text-h4 font-weight-medium pb-6"> {{ home.title }}</div>
                        <div class="d-flex">
                            <div class="py-3 d-flex">
                                <v-icon color="primary" class="align-self-center">mdi-map-marker-outline</v-icon>
                                <span class="text-decoration-underline align-self-center primary--text">
                                    {{ home.location.address }} {{ home.location.city }} {{ home.location.state }} {{
                                        home.location.country }}
                                </span>
                            </div>
                            <v-spacer />
                            <div>
                                <v-rating
:value="home.reviewValue" color="orange" dense half-increments readonly
                                    size="14" />
                                <div class="ms-4 text-right text--seconary">
                                    {{ home.reviewValue }} ({{ home.reviewCount }})
                                </div>
                            </div>
                        </div>
                        <v-divider class="my-6" />
                        <div class="text-h5">
                            {{ pluralize(home.guests, "guest") }} &middot;
                            {{ pluralize(home.bedrooms, "room") }} &middot;
                            {{ pluralize(home.beds, "bed") }} &middot;
                            {{ pluralize(home.bathrooms, "bath") }}
                        </div>
                    </v-col>
                    <v-divider vertical />
                    <v-col cols="5" class="pl-14">
                        <div>
                            <div class="mb-10">
                                <span class="text-h2 font-weight-medium primary--text">${{ home.pricePerNight }}
                                </span>
                                <span class="text-h4 text--secondary"> / night </span>
                            </div>
                            <date-range-picker v-model="bookingDates" />
                            <v-btn color="primary" class="my-8 text-h5 font-weight-medium" large block depressed>
                                Book Now !
                            </v-btn>
                        </div>
                    </v-col>
                </v-row>
            </v-container>
        </v-card>
    </div>
</template>

<script>
import pluralize from '~/utils/pluralize';
import { ISODate, addDays } from '~/utils/dateUtils';

export default {
    name: 'PropertyDetails',
    props: {
        home:{
            type: Object,
            required: true
        }
    },
    data: () => ({
        bookingDates: [ISODate(addDays(Date.now(), 7)), ISODate(addDays(Date.now(), 9))]
    }), 
    methods: {
        pluralize
    }
}
</script>