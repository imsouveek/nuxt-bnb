<script>
import { mapState } from 'vuex'
import { VCard, VTabs, VTab, VTabsItems, VTabItem } from 'vuetify/lib'

export default {
    async beforeRouteUpdate (to, from, next) {
        await this.$store.dispatch('admin/home/fetchHome', to.params.id)
        next()
    },
    async asyncData ({ store, params }) {
        await store.dispatch('admin/home/fetchHome', params.id)
    },
    data () {
        return {
            // Should replace this with an API in future
            tabItems: [{
                title: 'Basic Info',
                component: 'basic-info',
                save: 'none'
            }, {
                title: 'Address',
                component: 'address',
                save: 'none'
            }, {
                title: 'Images',
                component: 'images',
                save: 'pre'
            }, {
                title: 'Availability',
                component: 'availabilities',
                save: 'post'
            }],
            tabModel: 0,
            isUploading: false
        }
    },
    computed: {
        ...mapState('admin/home', ['_id', 'title'])
    },
    methods: {
        async componentSave (phase) {
            await Promise.all(
                this.tabItems
                    .filter(tab => tab.save === phase)
                    .map(tab => this.$refs[tab.component]?.save?.())
            )
        },
        async onSubmit () {
            const isValid = this.$refs.form.validateForm()
            if (!isValid) {
                alert('Please fill out all required fields.')
                return
            }

            this.isUploading = true
            try {
                // Some components may need to have save() called before home is saved
                // As of now, that is only the images component, because it uploads images on save
                // And it just holds images in app until parent component calls save
                // This design ensures that images are not loaded unnecessary
                // Home vuex state needs the image ids before calling save
                await this.componentSave('pre')

                await this.$store.dispatch('admin/home/saveHome')

                // Most additional components will need a save() call after home is saved
                // This will ensure that home id is available before related items are saved
                await this.componentSave('post')

                this.$router.push(`/admin/home/${this._id}`)
            } catch (err) {
                console.log(err)
                alert('Failed to save home')
            } finally {
                this.isUploading = false
            }
        }
    },
    render (h) {
        // 1️. Generate <v-tab> components for each tab label
        const tabs = this.tabItems.map(tab =>
            h(VTab, { key: tab.component }, tab.title)
        )

        // 2️. Generate <v-tab-item> with each dynamic component
        const tabItems = this.tabItems.map((tab, index) =>
            h(VTabItem, {
                key: tab.component,
                props: {
                    value: index
                }
            }, [
                h(`admin-home-${tab.component}`, {
                    ref: tab.component
                })
            ])
        )

        const tabItemsWrappedInCard = h(VCard, {
            props: { flat: true, outlined: true },
            class: 'mt-n2'
        }, tabItems)

        const tabsItemsBlock = h(VTabsItems, {
            props: {
                value: this.tabModel,
                class: 'pt-4',
                light: true
            }
        }, [tabItemsWrappedInCard])

        // 3️. Wrap everything in your AdminForm layout
        return h('admin-form', {
            props: {
                title: this._id ? this.title : 'Add a Home',
                btnText: this._id ? 'Save' : 'Add',
                isUploading: this.isUploading
            },
            on: {
                save: this.onSubmit
            },
            ref: 'form'
        }, [
            // 4. Add v-tabs (tab headers)
            h(VTabs, {
                props: {
                    value: this.tabModel,
                    dark: true,
                    backgroundColor: 'accent'
                },
                on: {
                    change: (val) => {
                        this.tabModel = val
                    }  // v-model equivalent
                }
            }, tabs),

            // 5️. Add v-tabs-items (tab panels)
           tabsItemsBlock
        ])
    }

}
</script>

<style lang="scss" scoped>
::v-deep.theme--dark.v-list {
    background-color: #3b210c;
}
</style>
