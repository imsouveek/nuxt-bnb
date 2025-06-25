<template>
    <v-container class="mt-8">
        <v-row>
            <v-spacer></v-spacer>
            <v-col cols="12" md="9">
                <v-card flat outlined>
                    <v-img
                        :src="banner.image"
                        height="300px"
                    />
                </v-card>
            </v-col>
            <v-spacer></v-spacer>
        </v-row>
    </v-container>
</template>

<script>
export default {
    name: 'HeroBanner',
    props: {
        banner: {
            type: Object,
            required: true
        }
    }
}
</script>