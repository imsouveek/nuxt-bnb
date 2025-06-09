<template>
    <v-menu
ref="menu" v-model="menu" :close-on-content-click="close_on_content_click" :close-on-click="close_on_click"
        transition="scale-transition" offset-y min-width="50" bottom right :disabled="disabled">
        <template #activator="{ on, attrs }">
            <div :class="`dateRangeSelector ${menu ? 'active-open' : ''}`">
                <v-input v-for="(field, index) in fields" v-bind="attrs" :key="index" hide-details dense v-on="on"  >
                    <template #prepend>
                        <div :class="`py-1 my-1 pl-2 ${field.styleclasses}`">
                            <v-icon @click="clickHandler">
                                {{ field.icon }}
                            </v-icon>
                        </div>
                    </template>
                    <div class="pt-3">
                        <label for="dateInput">
                            {{ labels[index] }}
                        </label>
                        <input id="dateInput" type="text" :value="value[index]" class="pt-3" autocomplete="off" @click.stop.prevent="clickHandler"/>
                    </div>
                </v-input>
            </div>
        </template>
        <v-date-picker
ref="calendar" :value="value" no-title scrollable range :allowed-dates="allowedDates"
            class="dateRangeSelector" @click:date="clickHandler" @mouseenter:date="hoverHandler" />
    </v-menu>
</template>

<script>
export default {
    name: 'DateRangePicker',
    model: {
        prop: 'value',
        event: 'change'
    },
    props: {
        value: {
            type: Array,
            default: () => []
        },
        labels: {
            type: Array,
            default: () => ['Check-In', 'Check-Out']
        }
    },
    data: () => ({
        dateRange: [],
        menu: false,
        disabled: false,
        clickCount: 0,
        close_on_content_click: false,
        close_on_click: false,
        fields: [{
            icon: 'mdi-calendar-start-outline',
            styleclasses: ''
        }, {
            icon: 'mdi-calendar-end-outline',
            styleclasses: 'end-date'
        }]
    }),
    watch:{
        menu(){
            if (this.clickCount == 1){
                this.menu = true
            }
        }
    },
    mounted() {
        this.dateRange = [this.value[0], this.value[1]]
    },
    methods: {
        clickHandler(clickedDate) {
            if (typeof clickedDate === 'object') {
                if (!this.menu) {
                    this.menu = true
                    this.close_on_click = true
                    return
                } else {
                    if (this.clickCount == 1) {
                        this.close_on_click = false
                        return
                    }
                    return
                }
            } else {
                this.close_on_click = false
            }

            this.$set(this.dateRange, this.clickCount, clickedDate)
            ++ this.clickCount

            if (this.clickCount == 2) {
                this.menu = false
                this.clickCount = 0
            } else {
                this.$set(this.dateRange, 1, '')
            }
            this.$emit('change', this.dateRange)
        },
        hoverHandler(date) {
            if (this.clickCount != 1) {
                return
            }
            var startDate = new Date(this.dateRange[0])
            var mouseDate = new Date(date)
            var mouse_yyyymm = date.slice(0, 8)
            this.$refs.calendar.$el.querySelectorAll("tbody td button").forEach((node) => {
                var nodeDate = new Date(`${mouse_yyyymm}${node.children[0].textContent.padStart(2, '0')}`)
                if (nodeDate > startDate && nodeDate < mouseDate) {
                    node.classList.add("v-btn--active")
                } else {
                    node.classList.remove("v-btn--active")
                }

                if (nodeDate.toString() === mouseDate.toString()) {
                    node.classList.add("v-date-picker--last-in-range")
                } else {
                    node.classList.remove("v-date-picker--last-in-range")
                }
            })

        },
        allowedDates(val) {
            if (this.clickCount == 0) {
                return new Date(val) >= new Date(Date.now() - 24*60*60*1000)
            } else {
                return new Date(val) >= new Date(this.dateRange[0])
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~vuetify/src/styles/styles.sass';
@import '~vuetify/src/components/VTextField/_variables.scss';

::v-deep.dateRangeSelector {

    // Styling for the input field
    border: $text-field-outlined-fieldset-border-width solid map-get($material-light, 'text-fields', 'outlined');
    border-radius: $text-field-border-radius;
    background-color: $white;
    display: flex;

    &:hover {
        border-color: currentColor;
    }

    &.active-open {
        border: $text-field-outlined-fieldset-border;
        border-color: var(--v-primary-base);

        * {
            color: var(--v-primary-base);
            ;
        }
    }

    label {
        left: -8px;
        position: absolute;
        transform: $text-field-dense-label-active-transform;
    }

    input {
        color: transparent !important;
        text-shadow: map-get($material-light, 'text', 'primary') 0px 0px 0px;
        overflow: hidden;
        min-width: 0;
        width: 100%;
    }

    .end-date {
        border-left: $text-field-outlined-fieldset-border-width solid map-get($material-light, 'text-fields', 'outlined');
    }

    // Styling for the calendar
    .v-date-picker-table__current {
        border: none;
        color: var(--v-primary-base) !important;
        font-weight: 900;
    }

    .v-btn--rounded {
        border-radius: $text-field-border-radius;
        width: 100%;
    }

    .v-btn--active {
        background-image: linear-gradient(var(--v-secondary-base) 0%, var(--v-secondary-base) 100%);
        border-radius: 0px;
        border-spacing: 0px;
        --webkit-border-horizonntal-spacing: 0px;
        width: 100%;

        &:not(.v-date-picker--first-in-range, .v-date-picker--last-in-range) {
            color: map-get($material-light, 'text', 'primary') !important;
        }
    }

    td:has(.v-date-picker--first-in-range, .v-date-picker--last-in-range) .v-btn {
        color: $white !important;
        border-radius: $text-field-border-radius 0 0 $text-field-border-radius;
        background-image: linear-gradient(var(--v-primary-base) 0%, var(--v-primary-base) 100%);
    }

    td:has(.v-date-picker--last-in-range):not(td:has(.v-date-picker--first-in-range)) .v-btn {
        border-radius: 0 $text-field-border-radius $text-field-border-radius 0;
    }
}
</style>