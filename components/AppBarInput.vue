<template>
    <div class="appBarInput">
        <v-input hide-details dense>
            <template #prepend>
                <div class="py-1 my-1 pl-2">
                    <v-icon>
                        mdi-map-marker
                    </v-icon>
                </div>
            </template>
            <div class="pt-3 full-width">
                <label :for="inputId">
                    Address
                </label>
                <input
                    :id="inputId" type="text" :value="value" class="pt-3 full-width"
                    autocomplete="off" @input="$emit('input', $event.target.value)"
                    @changed="$emit('changed', $event)"
                />
            </div>
            <template #append>
                <div v-if="value.length > 0" class="py-1 my-1 pr-2">
                    <v-icon color="error" @click="clearInput">
                        mdi-close
                    </v-icon>
                </div>
            </template>
        </v-input>
    </div>
</template>

<script>
export default {
    name: 'AppBarInput',
    props: {
        value: {
            type: String,
            default: ''
        },
        inputId: {
            type: String,
            default: ''
        }
    },
    methods: {
        clearInput () {
            this.$emit('input', '')
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~vuetify/src/styles/styles.sass';
@import '~vuetify/src/components/VTextField/_variables.scss';

::v-deep.appBarInput {

    // Styling for the input field
    border: $text-field-outlined-fieldset-border-width solid map-get($material-light, 'text-fields', 'outlined');
    border-radius: $text-field-border-radius;
    background-color: $white;
    & .full-width{
        width: 100%;
    }
    display: flex;
    &:hover {
        border-color: currentColor;
    }

    &:has(input:focus) {
        border: $text-field-outlined-fieldset-border;
        border-color: var(--v-primary-base);

        *:not(input) {
            color: var(--v-primary-base);
            ;
        }
    }

    label {
        left: -8px;
        position: absolute;
        transform: $text-field-dense-label-active-transform;
    }

}

</style>
