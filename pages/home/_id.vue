<template>
    <div>
        <property-gallery :images="home.images"/>
        <property-details :home="home"/>
        <property-description :home="home"/>
        <property-map :home="home"/> 
        <property-reviews :reviews="reviews"/>
        <property-host :user="user"/>
    </div>
</template>

<script>
export default {
    async asyncData({params, $api, error}) {
        try {
            const responses = await Promise.all([
                $api.$get(`/search/homes/${params.id}`),
                $api.$get(`/search/homes/${params.id}/reviews`),
                $api.$get(`/search/homes/${params.id}/owner`)
            ])
            
            if (!responses[0] || !responses[2]) {
                error( {statusCode: 404, message: "Home not found!"})
            }
            return {
                home: responses[0],
                reviews: responses[1],
                user: responses[2]
            }
        } catch (e) {
            //console.log(e)
            error( e)
        }
    },
    head() {
        return {
            title: this.home.title
        }
    }
}
</script>