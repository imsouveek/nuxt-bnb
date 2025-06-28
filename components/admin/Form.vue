<template>
    <v-form ref="adminForm" @submit.prevent="$emit('save')">
        <v-card flat>
            <v-card-title>
                <div class="text-h4 primary--text">
                    {{ title }}
                </div>
            </v-card-title>
            <v-card-text>
                <slot></slot>
            </v-card-text>
            <v-card-actions>
                <v-btn color="primary" type="submit" width="10vw" depressed>
                    {{ btnText }}
                </v-btn>
            </v-card-actions>
            <v-overlay absolute :value="isUploading">
                <v-progress-circular indeterminate color="secondary" />
            </v-overlay>
        </v-card>
    </v-form>
</template>

<script>
export default {
    name: 'AdminForm',
    props: {
        title: {
            type: String,
            required: true
        },
        isUploading: {
            type: Boolean,
            default: false
        },
        btnText: {
            type: String,
            default: 'Save'
        }
    },
    created () {
        if (!this.$slots.default) {
            console.error('TestComponent requires content be provided in the slot.')
        }
    },
    methods: {
        validateForm () {
            return this.$refs.adminForm?.validate?.()
        }
    }
}
</script>
