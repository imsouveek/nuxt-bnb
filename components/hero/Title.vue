<template>
    <div>
        <v-parallax src="/images/hero.jpg" height="600">
            <v-overlay absolute color="primary" opacity="0.4"></v-overlay>
            <v-layout
                fill-height
                align-center
                justify-center
                column
                class="white--text text-center z-index-1"
            >
                <h1 class="text-h1 font-weight-bold mb-2">
                    Book Unique Stays
                </h1>
                <h4 class="text-h6">
                    Find your perfect getaway across the globe
                </h4>
            </v-layout>
        </v-parallax>
    </div>
</template>

<script>
export default {
    name: "HeroTitle"
}
</script>

<style scoped>
.z-index-1 {
    z-index: 100;
}
</style>