<template>
    <v-card color="secondary" class="px-2" flat>
        <v-container>
            <v-row>
                <v-col cols="7" class="pl-0 pr-14 py-8 align-self-center">
                    <div class="text-h5 font-weight-medium pb-6">
                        Description
                    </div>
                    <div> {{ home.description }} </div>
                </v-col>
                <v-divider vertical />
                <v-col cols="5" class="pl-14 py-4 align-self-center">
                    <v-chip-group column>
                        <v-chip v-for="(feature, index) in home.features" :key="index" label large>
                            {{ feature }}
                        </v-chip>
                    </v-chip-group>
                </v-col>
            </v-row>
        </v-container>
    </v-card>
</template>

<script>
export default {
    name: 'PropertyDescription',
    props: {
        home: {
            type: Object,
            required: true
        }
    }
}
</script>
