<template>
    <v-container>
        <v-row>
            <v-spacer></v-spacer>
            <v-col cols="12" md="9">
                <v-card flat color="transparent">
                    <v-card-title>Recommended for You</v-card-title>
                    <v-tabs v-model="activeTab" background-color="accent"  dark>
                        <v-tab v-for="tab in propertyTabs" :key="tab">{{ tab }}</v-tab>
                    </v-tabs>
                    <v-tabs-items v-model="activeTab">
                        <v-card flat outlined class="mt-n2">
                            <v-tab-item v-for="tab in propertyTabs" :key="tab">
                                <v-slide-group show-arrows>
                                    <v-slide-item
                                        v-for="(home, i) in getHomes(tab)"
                                        :key="i"
                                        class="px-4"
                                    >
                                        <nuxt-link :to="`/home/${home._id}`" prefetch>
                                            <home-card :home="home"/>
                                        </nuxt-link>
                                    </v-slide-item>
                                </v-slide-group>
                            </v-tab-item>
                        </v-card>
                    </v-tabs-items>
                </v-card>
            </v-col>
            <v-spacer></v-spacer>
        </v-row>
    </v-container>
</template>

<script>
export default {
    name: "HeroRecommendations",
    props: {
        allHomes: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            activeTab: 0,
            propertyTabs: ["Popular", "Beachfront", "Family", "Luxury"],
        }
    },
    methods: {
        getHomes(tab) {
            return this.allHomes[tab] || [];
        },
    }
    
}
</script>
