<template>
    <v-text-field
        v-bind="$attrs"
        type="text"
        prepend-inner-icon="mdi-minus-circle-outline"
        append-icon="mdi-plus-circle-outline"
        :value="value"
        :rules="[
            rules.number,
            integer ? rules.integer : rules.skip,
            positive ? rules.positive : rules.skip
    ]"
        v-on="$listeners"
        @click:append="increaseNumber"
        @click:prepend-inner="decreaseNumber"
        @input="$emit('input')"
/>
</template>

<script>
export default {
    name: 'NumberInput',
    props: {
        value: {
            type: [Number, String],
            default: 0
        },
        default: {
            type: Number,
            default: 0
        },
        integer: {
            type: Boolean,
            default: false
        },
        positive: {
            type: Boolean,
            default: false
        }
    },
    data: () => ({
        rules: {
            required: value => !!value || 'Required',
            skip: () => true,
            number: (value) => {
                const pattern = /^[-]?[0-9]*(\.[0-9]+)?$/
                return pattern.test(value) || 'Invalid number'
            },
            integer: (value) => {
                const pattern = /^[-]?[0-9]*$/
                return pattern.test(value) || 'Invalid integer'
            },
            positive: (value) => {
                const pattern = /^[-][0-9]*$/
                return !pattern.test(value) || 'Not positive'
            }
        }
    }),
    methods: {
        increaseNumber () {
            let n = Number(this.value)
            n = isNaN(n) ? 0 : n
            n = n + 1
            this.$emit('input', n)
        },
        decreaseNumber () {
            let n = Number(this.value)
            n = n - 1
            n = this.positive && n < 0 ? 0 : n
            this.$emit('input', n)
        }
    }
}
</script>

<style lang="scss" scoped>
::v-deep input {
    text-align: center;
}
</style>
