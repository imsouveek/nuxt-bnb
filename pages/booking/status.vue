<template>
    <div>
        <div class="px-16">
            <v-card flat>
                <v-card-title>
                    <span v-if="bookingStatus" class="text-h6 success--text">Booking Confirmed</span>
                    <span v-else class="text-h6 error--text">Booking Failed</span>
                </v-card-title>
                <v-card-text >
                    <div v-if="bookingStatus">
                        <p>Booking <strong>{{ bookingId }}</strong> is confirmed</p>
                        <v-card class="mt-6">
                            <v-img
                                :src="$imageHandler.get(bookingDetails.home.images[0])"
                                height="200px"
                                cover
                            />
                            <v-card-title class="headline">
                                {{ bookingDetails.home.title }}
                            </v-card-title>
                            <v-card-subtitle>
                                {{ bookingDetails.home.location.city }}, {{ bookingDetails.home.location.state }}
                            </v-card-subtitle>
                            <v-card-text>
                                <div><strong>Dates:</strong> {{ bookingDetails.startDate }} to {{bookingDetails.endDate }}</div>
                                <div><strong>Guest Name:</strong> {{ bookingDetails.user.name }}</div>
                                <div><strong>Guest Email:</strong> {{ bookingDetails.user.email }}</div>
                                <div><strong>Guests:</strong> {{ bookingDetails.guestCount }}</div>
                                <div><strong>Amount Paid:</strong> ₹{{ bookingDetails.totalAmount }}</div>
                            </v-card-text>
                            </v-card>
                    </div>
                    <div v-else>
                        <p>Error: {{ error }}</p>
                    </div>
                </v-card-text>
            </v-card>
        </div>
        <nuxt-link to="/">Back to Home</nuxt-link> 
    </div>
</template>

<script>
import { fromEpochDate } from '~/utils/dateUtils';

export default {
    name: 'BookingStatusPage',
    async asyncData({$api, query }) {
        const { success, bookingId, error = '' } = query

        let bookingApiResponse = null
        let finalError = error

        if (success === 'true') {
            try {
                bookingApiResponse = await $api.$get(`/bookings/${bookingId}`)
                bookingApiResponse.startDate = fromEpochDate(bookingApiResponse.startEpoch)
                bookingApiResponse.endDate = fromEpochDate(bookingApiResponse.endEpoch)
            } catch(err) {
                finalError = err.message || 'Could not get booking details'
            }
        }

        return {
            bookingId,
            bookingStatus: success === 'true' && bookingApiResponse.status === 'Success',
            bookingDetails: {
                ...bookingApiResponse
            },
            error: finalError,
        }
    }
}
</script>