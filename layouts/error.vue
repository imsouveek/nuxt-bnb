<template>
    <div></div>
</template>

<script>
export default {
    name: 'ErrorLayout',
    props: {
        error: {
            type: Object,
            required: true
        }
    },
    mounted () {
        this.$nuxt.context.redirect('/error', this.error)
    }
}
</script>
