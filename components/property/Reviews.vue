<template>
    <div>
        <v-card flat>
            <v-container>
                <v-row>
                    <v-col v-for="(review, index) in reviews" :key="index" cols="6">
                        <div class="d-flex flex-row">
                            <v-avatar size="100">
                                <img :src="review.reviewer.image" />
                            </v-avatar>
                            <div class="ml-4 align-self-center">
                                <div class="font-weight-bold text-h6">
                                    {{ review.reviewer.name }}
                                </div>
                                <div class="text-subtitle-1 text-decoration-underline">
                                    {{ shortDate(review.date) }}
                                </div>
                            </div>
                        </div>
                        <div class="py-4">
                            <short-text :text="review.comment" :target="150" /><br />
                        </div>
                    </v-col>
                </v-row>
            </v-container>
        </v-card>
    </div>
</template>

<script>
import { shortDate } from '~/utils/dateUtils'

export default {
    name: 'PropertyReviews',
    props: {
        reviews: {
            type: Array,
            required: true
        }
    },
    methods: {
        shortDate
    }
}
</script>
