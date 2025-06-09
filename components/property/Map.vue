<template>
    <div>
        <v-card flat class="py-8">

            <div class="property-maptitle text-h5 font-weight-medium pb-6"> Location </div>
            <p class="property-map-text">
                {{ home.location.address }}
                {{ home.location.city }}
                {{ home.location.state }}
                {{ home.location.country }}
            </p>
            <div ref="map" class="property-map"></div>
        </v-card>
    </div>
</template>

<script>
export default {
    name: 'PropertyMap',
    props: {
        home:{
            type: Object,
            required: true
        }
    },
    mounted() {
        this.$maps.showMap(this.$refs.map, this.home._geoloc.lat, this.home._geoloc.lng)
    }
}
</script>

<style lang="scss" scoped>
@import '~vuetify/src/styles/styles.sass';

::v-deep.property {
    
    &-map {
        height: 70vh;
        border-radius: $border-radius-root !important;
    }
}
</style> 