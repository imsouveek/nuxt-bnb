<template>
    <div>
        <property-gallery :images="home.images" />
        <property-details :home="home" />
        <property-description :home="home" />
        <property-map :home="home" />
        <property-reviews :reviews="reviews" />
        <property-host :user="user" />
    </div>
</template>

<script>
export default {
    async asyncData ({ params, $api, error }) {
        try {
            const responses = await Promise.all([
                $api.$get(`/search/homes/${params.id}`),
                $api.$get(`/search/homes/${params.id}/reviews`),
                $api.$get(`/search/homes/${params.id}/owner`)
            ])

            if (!responses[0] || !responses[2]) {
                error({ statusCode: 404, message: 'Home not found!' })
            }
            return {
                home: responses[0],
                reviews: responses[1],
                user: responses[2]
            }
        } catch (e) {
            error(e)
        }
    },
    head () {
        return {
            title: this.home.title,
            meta: [
                {hid: 'og-type', property: 'og:type', content: 'website'},
                {hid: 'og-title', property: 'og:title', content: this.home.title},
                {hid: 'og-desc', property: 'og:description', content: this.home.description},
                {hid: 'og-image', property: 'og:image', content: `${this.$config.url.app}${this.$imageHandler.get(this.home.images[0])}`},
                {hid: 'og-url', property: 'og:url', content: `${this.$config.url.app}/home/${this.home._id}`},
                {hid: 't-type', name: 'twitter:card', content: 'summary_large_image'}
            ]
        }
    }
}
</script>
