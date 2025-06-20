<template>
    <v-row>
        <v-col cols="7">
            <v-card flat>
                <div class="text-h4 mb-4">Stays in {{ label }}</div>
                <v-card-text class="overflow-y-auto search-results">
                    <div v-if="homes.length > 0">
                        <nuxt-link
v-for="home in homes" :key="home._id" :to="`/home/${home._id}`" prefetch
                            style="text-decoration: none;">
                            <home-card
horizontal show-extra-details :home="home"
                                @mouseover.native="highlightMarker(home._id, true)"
                                @mouseout.native="highlightMarker(home._id, false)" />
                        </nuxt-link>
                    </div>
                    <div v-else>
                        <div class="text-h6 error--text">No Results found!</div>
                    </div>
                </v-card-text>
            </v-card>
        </v-col>
        <v-col cols="5">
            <v-card>
                <div ref="map" class="map" />
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
function getSearchApiUrl(queryParams) {
    const params = {
        ...queryParams,
        excludeBooked: queryParams.excludeBooked ?? 'true',
        radius: queryParams.radius ?? 10000,
    }
    delete params.label

    const search = new URLSearchParams(params)
    return `/search/homes?${search.toString()}`
}

export default {
    name: "SearchPage",
    async beforeRouteUpdate(to, from, next) {
        const data = await this.$api.$get(getSearchApiUrl(to.query))
        this.homes = data
        this.label = to.query.label
        this.lat = to.query.lat
        this.lng = to.query.lng
        this.updateMap()
        next()
    },
    async asyncData({query, $api}) {
        const data = await $api.$get(getSearchApiUrl(query))
        return {
            homes: data,
            label: query.label,
            lat: query.lat,
            lng: query.lng
        }
    },
    head(){
        return{
            title: `Homes Around ${this.label}`
        }
    },
    mounted() {
        this.updateMap()
    },
    methods: {
        highlightMarker(homeId, isHighlighted) {
            document.getElementsByClassName(`home-${homeId}`)[0]?.classList?.toggle('marker-highlighted', isHighlighted)
        },
        updateMap(){
            this.$maps.showMap(this.$refs.map, this.lat, this.lng, this.getHomeMarkers())
        },
        getHomeMarkers() {
            return this.homes.map((home) => {
                return {
                    ...home._geoloc,
                    pricePerNight: home.pricePerNight,
                    id: home._id
                }
            })
        }
    }
}
</script>

<style lang="scss">
@import '~vuetify/src/styles/styles.sass';

.map {
    height: 85vh
}

.search-results {
    height: 77vh;
}

.marker {
    color: var(--v-accent-base) !important;
    background-color: $white;
    border: 1px solid var(--v-accent-base) ;
    font-weight: bold;
    border-radius: $border-radius-root;
    padding: 5px 8px;
}

.marker-highlighted {
    color: $white !important;
    background-color: var(--v-accent-base);
    border-color: var(--v-accent-base);
}
</style>