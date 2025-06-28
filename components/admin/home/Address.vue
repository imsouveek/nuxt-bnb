<template>
    <v-card flat>
        <v-card-text>
            <v-text-field
                ref="locationSelector" dense outlined label="Location" placeholder="Search address"
                persistent-placeholder @changed="changed"
            />
            <v-text-field
                v-model="address" dense outlined label="Address" persistent-placeholder
                placeholder="Set address"
            />
            <v-text-field
                v-model="city" dense outlined label="City" persistent-placeholder
                placeholder="Set city"
            />
            <v-text-field
                v-model="state" dense outlined label="State" persistent-placeholder
                placeholder="Set state"
            />
            <v-text-field
                v-model="postalCode" dense outlined label="Postal Code" persistent-placeholder
                placeholder="Set postal code"
            />
            <v-text-field
                v-model="country" dense outlined label="Country" persistent-placeholder
                placeholder="Set country"
            />
        </v-card-text>
    </v-card>
</template>

<script>
import { mapWritableFields } from '~/utils/vuexBindings'

export default {
    name: 'AdminHomeAddress',
    computed: {
        ...mapWritableFields('admin/home', [
            'address',
            'city',
            'state',
            'postalCode',
            'country',
            'lat',
            'lng'
        ])
    },
    mounted () {
        this.$maps.makeAutoComplete(
            this.$refs.locationSelector.$el.querySelector('input'),
            ['address']
        )
    },
    methods: {
        changed (event) {
            const place = event.detail
            const parts = place.address_components || []

            const get = type =>
                parts.find(p => p.types.includes(type))?.short_name || ''

            const getLong = type =>
                parts.find(p => p.types.includes(type))?.long_name || ''

            this.address = `${get('street_number')} ${get('route')}`.trim()
            this.city = get('locality') || get('postal_town')
            this.state = getLong('administrative_area_level_1')
            this.postalCode = get('postal_code')
            this.country = getLong('country')

            const geo = place.geometry?.location || { lat: () => '', lng: () => '' }

            this.lat = geo.lat()
            this.lng = geo.lng()
        }
    }
}
</script>
