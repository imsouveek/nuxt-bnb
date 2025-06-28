<template>
    <div>
        <v-card flat>
            <v-card-title>
                <div class="text-h4 primary--text">
                    List of Homes
                </div>
            </v-card-title>
            <v-card-text>
                <v-card>
                    <v-data-table :headers="headers" :items="homeList">
                        <!-- eslint-disable-next-line vue/valid-v-slot -->
                        <template #item.title="{ item }">
                            <v-btn text nuxt color="primary" :to="`/admin/home/${item._id}`">
                                {{ item.title }}
                            </v-btn>
                        </template>
                        <!-- eslint-disable-next-line vue/valid-v-slot -->
                        <template #item.actions="{ item }">
                            <v-icon small @click="showDeleteDialog(item)">
                                mdi-delete
                            </v-icon>
                        </template>
                    </v-data-table>
                </v-card>
            </v-card-text>
            <v-card-actions class="d-flex justify-end">
                <v-btn text nuxt color="primary" depressed to="/admin/home/add">
                    Add a New Home
                </v-btn>
            </v-card-actions>
        </v-card>
        <v-overlay :value="isUploading">
            <v-progress-circular v-if="!dialogDelete" indeterminate color="secondary" />
            <v-dialog v-model="dialogDelete" light max-width="500px">
                <v-card>
                    <v-card-title class="text-h5">
                        Are you sure you want to delete this item?
                    </v-card-title>
                    <v-card-actions>
                        <v-spacer />
                        <v-btn depressed outlined @click="cancelDelete">
                            Cancel
                        </v-btn>
                        <v-btn depressed color="error" @click="deleteHome">
                            Delete
                        </v-btn>
                        <v-spacer />
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-overlay>
    </div>
</template>

<script>
export default {
    name: 'UserHomes',
    async asyncData ({ $api }) {
        return {
            homeList: await $api.$get('/homes?fieldList=_id&fieldList=title')
        }
    },
    data: () => ({
        dialogDelete: false,
        isUploading: false,
        deletedItem: null,
        headers: [{
            text: 'Home Title',
            value: 'title'
        }, {
            text: 'Actions',
            value: 'actions',
            sortable: false,
            align: 'center',
            width: '100px'
        }]
    }),
    methods: {
        showDeleteDialog (item) {
            this.isUploading = true
            this.dialogDelete = true
            this.deletedItem = item
        },
        cancelDelete () {
            this.isUploading = false
            this.dialogDelete = false
            this.deletedItem = null
        },
        async deleteHome () {
            await this.$api.delete(`/homes/${this.deletedItem._id}`)
            this.homeList = this.homeList.filter(home => home._id !== this.deletedItem._id)
            this.isUploading = false
            this.dialogDelete = false
            this.deletedItem = null
        }
    }
}
</script>
