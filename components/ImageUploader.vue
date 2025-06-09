<template>
    <v-card class="pa-4 full-space" flat>
        <div
class="full-space bordered py-4" @dragenter="isDragEnter=true" @dragleave="isDragEnter=false"
            @dragend="isDragEnter=false" @drop="isDragEnter=false">
            <input v-if="showUploadOption" ref="fileInput" class="display-none" type="file" accept="image/*" :multiple="!single" @change="addImages"/>
            <input
v-if="showUploadOption" class="hide-by-opacity full-space drop-area" type="file" accept="image/*" :multiple="!single"
                @click.prevent @change="addImages"/>
            <div v-if="images.length > 0">
                <v-container>
                    <v-row no-gutters>
                        <v-col v-for="(image, index) in imageSources" :key="index" :cols="single? 12: 2">
                            <v-card class="rounded-0 mx-auto" :max-height="previewHeight" :max-width="previewWidth">
                                <v-img :src="image" :height="previewHeight" :width="previewWidth" />
                                <v-btn
absolute top right dark fab small color="secondary" class="fab"
                                    @click="deleteImage(index)">
                                    <v-icon color="primary">
                                        mdi-close
                                    </v-icon>
                                </v-btn>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-container>
            </div>
            <div v-if="showUploadOption" class="full-space d-flex flex-column align-center justify-center">
                <div class="text-h6 primary--text">
                    {{ isUploading ? 'Uploading...' : dropString }}
                </div>
                <div :class="isDragEnter || isUploading ? 'hide-by-layer' : ''"> Or</div>
                <v-btn
color="primary" depressed :class="isDragEnter || isUploading ? 'hide-by-layer' : 'top-layer'"
                    @click="$refs.fileInput.click()">
                    {{ images.length > 0 ? 'Upload More' : 'Browse' }}
                </v-btn>
            </div>
        </div>
        <v-overlay absolute :value="isUploading">
            <v-progress-circular indeterminate color="secondary" />
        </v-overlay>
    </v-card>
</template>

<script>
export default {
    name: 'ImageUploader',
    model: {
        prop: 'value',
        event: 'change'
    },
    props: {
        value: {
            type: [String, Array],
            default: () => []
        },
        single: {
            type: Boolean,
            default: false
        },
        previewWidth: {
            type: Number,
            default: 150
        },
        previewHeight: {
            type: Number,
            default: 100
        }
    },
    data: () => ({
        images: [],
        deletedImages: [],
        isUploading: false,
        isDragEnter: false
    }),
    computed: {
        dropString() {
            return this.single ? 'Drag and drop image here' : 'Drag and drop images here'
        },
        imageSources() {
            return this.images.map(str => {
                if (str.startsWith('data:image')) {
                    return str
                } else return this.$imageHandler.get(str, {
                    width: this.previewWidth,
                    height: this.previewHeight,
                    fit: 'cover'
                })
            })
        },
        showUploadOption() {
            return this.images.length === 0 || !this.single
        }
    },
    mounted() {
        this.emitInterface()
        if (this.single) {
            if (this.value) {
                this.images.push(this.value)
            }
        } else {
            this.images = this.value.map(a => a)
        }
    },
    methods: {
        async addImages(event) {
            this.isUploading = true
            let temp = []

            for (const file of event.target.files) {
                if (!file) continue
                temp.push(this.$imageHandler.read(file))
            }

            const result = await Promise.all(temp)
            this.images = this.images.concat(result)
            this.isUploading = false
        },

        async deleteImage(index) {
            this.isUploading = true
            const id = this.images[index]
            if (!id.startsWith('data:image')) {
                this.deletedImages.push(id)
            }
            this.images.splice(index, 1)
            this.isUploading = false
        },

        async save() {
            this.isUploading = true

            // Delete the images that are removed
            let deleteTasks = []
            for (const id of this.deletedImages) {
                deleteTasks.push(this.$imageHandler.remove(id))
            }
                
            this.deletedImages = []
            await Promise.all(deleteTasks)
            
            // Save the images that have been added
            let addTasks = []
            for (const str of this.images) {
                if (str.startsWith('data:image')) {
                    addTasks.push(this.$imageHandler.put(str))
                }
            }
            
            const result = await Promise.all(addTasks)
            this.images = this.images.map(str => {
                if (str.startsWith('data:image')) {
                    return result.shift().id
                }
                return str
            })

            this.isUploading = false
            if (this.single) {
                this.$emit('change', this.images[0])
            } else{
                this.$emit('change', this.images)
            }
        },

        emitInterface() {
            this.$emit('interface', {
                save: () => this.save()
            })
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~vuetify/src/styles/styles.sass';

::v-deep.bordered {
    border: 2px dashed var(--v-accent-base);
    border-radius: $border-radius-root;
}
::v-deep.hide-by-opacity {
    opacity: 0; 
}

::v-deep.hide-by-layer {
    z-index: -1;
}

::v-deep.drop-area {
    position: absolute;
    top: 0;
    z-index: 1;
}
::v-deep.display-none {
    display: none;
}

::v-deep.full-space {
    height: 100% !important;
    width: 100% !important;
}

::v-deep.top-layer {
    position: relative; 
    z-index: 2;
}

::v-deep.fab {
    height: 30px;
    width: 30px;
    right: -15px;
}
</style>
