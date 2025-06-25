<template>
    <v-card flat>
        <v-card-text>
            <image-uploader ref="uploader" v-model="images" @interface="getChildInterface"/>
        </v-card-text>
    </v-card>
</template>

<script>
import { mapWritableFields } from '~/utils/vuexBindings'

export default {
    name: 'AdminHomeImages',
    data: () => ({
        childInterface: null
    }),
    computed: {
        ...mapWritableFields('admin/home', ['images'])
    },
    methods: {
        getChildInterface(childInterface) {
            this.childInterface = childInterface
        },
        async save() {
            await this.childInterface?.save?.()
        }
    }
}
</script>