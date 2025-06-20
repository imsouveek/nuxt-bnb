<template>
    <v-row class="mx-auto">
        <v-col v-for="home in homes" :key="home._id" sm="12" md="6" lg="4" xl="3" >
            <nuxt-link :to="`/home/${home._id}`" prefetch>
                <home-card :home="home"/>
            </nuxt-link>
        </v-col>
    </v-row>
</template>

<script>
export default {
    name: "HomePage",

    async asyncData({ $api }) {
        try {
            return {
                homes: await $api.$get('/search/homes')
            }
        } catch (e) {
            console.log(e)
        }

    },

    head() {
        return {
            title: 'Homepage',
            meta: [{
                name: 'description',
                content: 'This is a homepage',
                hid: 'description'
            }]
        }
    }
}
</script>