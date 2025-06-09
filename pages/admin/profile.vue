<template>
    <admin-form title="Profile" :is-uploading="isUploading" @save="saveHandler">
        <v-container>
            <v-row>
                <v-col cols="6">
                    <div class="profileImage">
                        <image-uploader
ref="imageUploader" v-model="profile.image" single
                            :preview-height="210" :preview-width="210" @interface="getChildInterface" />
                    </div>
                    <v-text-field
v-model="profile.name" dense outlined persistent-placeholder placeholder="Name" type="text"
                        label="Name" />
                    <v-text-field
v-model="profile.email" dense outlined persistent-placeholder placeholder="Email" type="text"
                        label="Email" />
                    <v-text-field
v-model="password" outlined dense clearable type="password" label="Password"
                        password persistent-placeholder placeholder="......" :rules="passwordRules" />
                    <v-text-field
v-model="confirm" outlined dense clearable type="password" label="Re-enter Password"
                        password persistent-placeholder placeholder="......" :rules="confirmRules" />
                    <v-textarea
v-model="profile.description" persistent-placeholder outlined label="Description"
                        placeholder="Describe you" />
                    <div> You have {{ profile.reviewCount }} reviews </div>
                    <div> Joined: {{ Date(profile.createdAt) }} </div>
                    <div> Last modified: {{ Date(profile.updatedAt) }} </div>
                </v-col>
            </v-row>
        </v-container>
    </admin-form>
</template>

<script>
export default {
    name: 'AdminProfile',
    childInterface: {
        save: () => undefined
    },
    async asyncData({ $api }) {
        let payload
        try {
            payload = await $api.$get(`/users`)
        } catch (error) {
            // silently ignore errors here — handled later
        }
        if (payload) {
            if (!payload.image) {
                payload.image = ''
            }
            return {
                profile: payload
            }
        } else {
            return {
                profile: {
                    name: '',
                    email: '',
                    reviewCount: '',
                    description: '',
                    image: '',
                    createdAt: '',
                    updatedAt: ''
                }
            }
        }
    },
    data: () => ({
        isUploading: false,
        password: '',
        confirm: '',
    }),
    computed: {
        passwordRules() {
            const rules = []

            const requiredCharactersRule =
                v => (!v || /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/.test(v)) || 'Password must contain at least lowercase letter, one number, a special character and one uppercase letter'
            rules.push(requiredCharactersRule)

            return rules
        },
        confirmRules() {
            const rules = []
            if (this.password) {
                const requiredRule = v => !!v || 'Password confirm is required'
                rules.push(requiredRule)

                const matchRule =
                    v => (!!v && v) === this.password || 'Password values do not match'
                rules.push(matchRule)
            }

            return rules
        }
    },
    methods: {
        async saveHandler() {
            this.isUploading = true
            await this.$options.childInterface.save()

            const {name, email, description, image} = this.profile
            const updateObj = {name, email, description, image}
            
            if (this.password) {
                updateObj.password = this.password
            } 
            await this.$api.$patch(`/users`, {...updateObj})

            // Reset password fields
            this.password=''
            this.confirm=''

            // Have to update user details in store
            this.$store.commit('auth/user', this.profile)

            this.isUploading = false
        },
        getChildInterface(childInterface) {
            this.$options.childInterface = childInterface
        }
    }
}
</script>

<style lang="scss" scoped> 
::v-deep.profileImage {
    width: 300px;
    height: 300px;
}
</style>