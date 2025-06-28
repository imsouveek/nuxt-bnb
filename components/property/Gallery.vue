<template>
    <div>
        <v-menu v-model="showMenu" :close-on-content-click="false" :close-on-click="true">
            <template #activator="{ on , attrs }">
                <v-card class="mb-4 image-gallery" flat v-bind="attrs" v-on="on">
                    <v-container>
                        <v-row height="400px">
                            <v-col cols="6" class="py-0 pl-0 ma-0">
                                <v-img class="image-n0" :src="$imageHandler.get(images[0])" height="424px" @click="clickHandler(0)" />
                            </v-col>
                            <v-col cols="6" class="py-0 pr-0">
                                <v-row height="200px">
                                    <v-col v-for="n in 4" :key="n" cols="6">
                                        <v-img :class="`image-n${n}`" :src="$imageHandler.get(images[n])" height="200px" @click="clickHandler(n)" />
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card>
            </template>
            <v-carousel v-model="carouselItem" hide-delimiters height="70vh">
                <v-carousel-item v-for="(image, i) in images" :key="i" :src="$imageHandler.get(image)" />
            </v-carousel>
        </v-menu>
        <v-overlay :value="showMenu" />
    </div>
</template>

<script>
export default {
    name: 'PropertyGallery',
    props: {
        images: {
            type: Array,
            required: true
        }
    },
    data: () => ({
        showMenu: false,
        carouselItem: 0
    }),
    methods: {
        clickHandler (target) {
            this.carouselItem = target
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~vuetify/src/styles/styles.sass';

::v-deep.image {
    &-n0 {
        border-radius: $border-radius-root 0 0 $border-radius-root;
    }

    &-n2 {
        border-radius: 0 $border-radius-root 0 0;
    }

    &-n4 {
        border-radius: 0 0 $border-radius-root 0;
    }
}
</style>
