<template>
    <v-card flat>
        <v-card-text>
            <v-text-field
v-model="title" dense outlined persistent-placeholder placeholder="Give your home a title"
                type="text" label="Title" :rules="[rules.required]"/>
            <v-textarea
v-model="description" persistent-placeholder outlined label="Description"
                placeholder="Describe your home" :rules="[rules.required]"/>
            <v-textarea
v-model="note" persistent-placeholder outlined label="Note"
                placeholder="Add notes for guest" />
            <v-combobox
v-model="features" label="Features" :items="commonFeatures" dense
                :search-input.sync="search" hide-selected multiple small-chips outlined persistent-placeholder
                placeholder="Select or add your home features">
                <template #no-data>
                    <v-list>
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title>
                                    No results matching "<strong>{{ search }}</strong>". Press
                                    <kbd>enter</kbd>
                                    to create a new one
                                </v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                </template>
            </v-combobox>
            <v-text-field
v-model="pricePerNight" dense outlined type="text" label="Price Per Night"
                persistent-placeholder placeholder="Set price per night" :rules="[rules.required]"/>
            <div class="d-flex">
                <number-input v-model="guests" dense outlined label="Guests" class="mr-2" integer positive />
                <number-input v-model="bedrooms" dense outlined label="Rooms" class="mr-2" integer positive />
                <number-input v-model="beds" dense outlined label="Beds" class="mr-2" integer positive />
                <number-input v-model="bathrooms" dense outlined label="Baths" integer positive />
            </div>
        </v-card-text>
    </v-card>
</template>

<script>
import { mapWritableFields } from '~/utils/vuexBindings'

export default {
    name: 'AdminHomeBasicInfo',
    data() {
        return {
            rules: {
                required: value => !!value || 'Required'
            },
            search: null,
            commonFeatures: ['Electric Kettle', 'Air-conditioning', 'City View'],
        }
    },
    computed: {
        ...mapWritableFields('admin/home', [
            'title',
            'description',
            'note',
            'features',
            'pricePerNight',
            'guests',
            'bedrooms',
            'beds',
            'bathrooms'
        ])
    }
}
</script>