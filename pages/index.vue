<template>
    <div>
        <v-app-bar color="secondary" style="z-index:100; opacity: 0.9" flat>
            <v-container>
                <v-row justify="center">
                    <v-col cols="12" md="9">
                        <v-row class="align-center">
                            <v-col cols="4" md="2" class="d-flex flex-row">
                                <v-img src="/images/logo.svg" height="45" contain class="mt-n2 ml-n8"/>
                            </v-col>
                            <v-col cols="4" md="8">
                                <v-spacer/>
                            </v-col>
                            <v-col cols="4" md="2" class="d-flex flex-row">
                                <v-spacer/>
                                <sign-on-button/>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
            </v-container>
        </v-app-bar>
        <v-main class="bg">
            <hero-title class="mt-n16"/>
            <v-container class="mt-n12">
                <v-row justify="center">
                    <v-col cols="12" sm="10" md="7">
                        <v-card elevation="12" color="secondary" light>
                                <search-bar :show-sign-on="false" :show-logo="false" @change="dateChange"/>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
            <hero-top-destinations :top-destinations="topDestinations" :link-dates="dates"/>
            <hero-banner :banner="banner"/>
            <hero-recommended-homes :all-homes="allHomes"/> 
        </v-main>       
    </div>
</template>

<script>
import { ISODate, addDays } from "~/utils/dateUtils";

export default {
    name: "HomePage",
    layout: "blank",
    async asyncData({ $config, $api }) {
        let res, config
        try {
            res = await fetch(`${$config.url.app}/hero.json`)
            config = await res.json()
        } catch(err) {
            console.log(err)
        }     

        const recommendationsList = config.recommendations
        const allIds = [...new Set(Object.values(recommendationsList).flat())]

        const homes = await $api.$get(`/search/homes?homeIds=${allIds.join(',')}`)
        const homeMap = Object.fromEntries(homes.map(h => [h._id, h]))

        const allHomes = {}
        for (const category in recommendationsList) {
            allHomes[category] = recommendationsList[category]
            .map(id => homeMap[id])
            .filter(Boolean)
        }

        return {
            banner: config.banner,
            topDestinations: config.topDestinations,
            allHomes
        }
    },
    data() {
        return {
            inputText: "",

            dates: [
                ISODate(addDays(Date.now(), 7)),
                ISODate(addDays(Date.now(), 9)),
            ],
            
            place: null,
        }
    },
    async mounted() {
        await this.$initSession();
        this.$maps.makeAutoComplete(document.getElementById("citySearch"));
    },
    methods: {
        dateChange(val) {
            this.$set(this.dates, 0, val[0])
            this.$set(this.dates, 1, val[1])
        },
        getHomes(tab) {
            return this.allHomes[tab] || [];
        }
    },
};
</script>

<style lang="scss" scoped>
::v-deep.float-top {
    position: absolute;
    top: 0;
    z-index: 100;

    &-left {
        left: 0;
    }

    &-right {
        right: 0;
    }
}

::v-deep.bg {
    background-color: var(--v-secondary-base);
}
</style>