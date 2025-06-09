<template>
    <v-card flat>
        <v-card-text>
            <v-container>
                <v-row>
                    <v-col cols="9">
                        <date-range-picker v-model="datePickerRange" />
                    </v-col>
                    <v-col cols="3">
                        <v-btn block color="primary" depressed class="mt-2" @click="insertDays">Add</v-btn>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <v-data-table v-model="selected" :headers="headers" :items="dates" item-key="date" show-select>
                        </v-data-table>
                    </v-col>
                </v-row>
            </v-container>
        </v-card-text>
        <v-card-actions>
            <v-btn class="px-16" color="error" depressed @click="removeDays">Delete</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import { ISODate, addDays, toEpochDate, fromEpochDate } from '~/utils/dateUtils';

export default {
    name: 'AdminHomeAvailabilities',
    data: () => ({
        datePickerRange: [ISODate(addDays(Date.now(), 7)), ISODate(addDays(Date.now(), 14))],
        selected: [],
        headers: [{
            text: 'Date',
            value: 'date'
        }, { 
            text: 'Actions', 
            value: 'actions', 
            sortable: false,
            align: 'center',
            width: '100px' 
        }],
        dateValues: []
    }),
    computed:{
        dates() {
            return this.dateValues.map(v => {
                return {
                    date: `${fromEpochDate(v)}`
                }
            })
        }
    },
    async mounted() {
        if (this.$route.params.id !== 'add') {
            const res = await this.$api.$get(`/homes/${this.$route.params.id}/availabilities`)
            this.dateValues = res.map((v) => v.epochDate) || []
        }   
    },
    methods: {
        insertDays() {
            // Convert start and end to epoch
            const startDate = toEpochDate(this.datePickerRange[0])
            const endDate = toEpochDate(this.datePickerRange[1])

            const unique = new Set(this.dateValues)
            for (let i = startDate; i <= endDate; i++) {
                unique.add(i)
            }
            this.dateValues = Array.from(unique)
        },
        removeDays() {
            const toRemove = new Set(
                this.selected.map(item => toEpochDate(item.date))
            )
            this.dateValues = this.dateValues.filter(epoch => !toRemove.has(epoch))
            this.selected = []
        },
        async save() {
            const id = this.$route.params.id
            if (!id) throw new Error('Missing home ID')

            await this.$api.$post(`/homes/${id}/availabilities`, {
                availabilities: this.dateValues
            })
        },
    }
}
</script>