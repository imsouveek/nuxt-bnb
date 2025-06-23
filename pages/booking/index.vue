<template>
    <v-main>
        <v-container fluid fill-height secondary>
            <v-layout align-center justify-center>
                <v-flex xs12 sm8 md4>
                    <!-- <v-card flat outlined> -->
                        <div class="d-flex flex-column align-center justify-center py-10">
                            <v-progress-circular indeterminate color="primary" size="48" />
                            <div class="text-h6 mt-4">Processing Payment</div>
                        </div>
                    <!-- </v-card> -->
                </v-flex>
            </v-layout>
        </v-container>
    </v-main>
</template>

<script>
export default {
    name: 'BookingIndexPage',
    async mounted() {
        try {
            const { homeId, startEpoch, endEpoch, guestCount = 2, gateway = 'Razorpay' } = this.$route.query
            const response = await this.$api.$post('/bookings', {
                    homeId,
                    startEpoch,
                    endEpoch,
                    guestCount,
                    gateway
            })
            this.$razorpay.initPayment(response)
        } catch(err) {   
            this.$router.replace({ 
                path: '/booking/status', query: { 
                    error: err?.message || 'Unknown error'
                }
            })
        }
    }
}
</script>