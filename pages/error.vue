<template>
    <v-card flat class="d-flex flex-column align-center pt-8">
        <v-card flat>
            <v-img src="https://tinyurl.com/2s3rz735" />
        </v-card>
        <div class="text-h4 error--text pt-8">
            Umm! That's a booboo!!
        </div>
        {{ error.message }} ( {{ error.statusCode }} )
        <v-card-actions>
            <nuxt-link to="/" prefetch>
                <v-btn color="primary" depressed class="mt-4">
                    Back to Home
                </v-btn>
            </nuxt-link>
        </v-card-actions>
    </v-card>
</template>

<script>
export default {
    name: 'ErrorPage',
    layout: 'blank',
    asyncData ({ query }) {
        return {
            error: {
            ...query
            }
        }
    },
    head () {
        return {
            title: `${this.error.statusCode} Error`
        }
    }
}
</script>
