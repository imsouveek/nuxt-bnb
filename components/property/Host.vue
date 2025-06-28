<template>
    <div>
        <v-card color="secondary" flat class="mx-n2 px-2 py-8">
            <div class="d-flex flex-row">
                <v-avatar size="100" rounded>
                    <img
                        :src="$imageHandler.get(user.image, {
                            width: 200,
                            height: 200
                        })"
                    />
                </v-avatar>
                <div class="pl-4">
                    <div class="font-weight-bold text-h6">
                        {{ user.name }}
                    </div>
                    <div class="text-subtitle-1 text-decoration-underline">
                        Joined in {{ shortDate(user.joined) }}
                    </div>
                    <div class="text-h6 d-flex ml-n1">
                        <v-icon class="align-self-center">
                            mdi-star-outline
                        </v-icon>
                        <span class="align-self-center font-weight-light">
                            {{ user.reviewCount }} reviews
                        </span>
                    </div>
                </div>
            </div>
            <div class="py-8">
                {{ user.description }}
            </div>
        </v-card>
    </div>
</template>

<script>
import { shortDate } from '~/utils/dateUtils'

export default {
    name: 'PropertyHost',
    props: {
        user: {
            type: Object,
            required: true
        }
    },
    methods: {
        shortDate
    }
}
</script>
