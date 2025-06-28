import Vue from 'vue'

function isPlainObject (obj) {
    return Object.prototype.toString.call(obj) === '[object Object]'
}

function deepMergeReactive (target, source) {
    for (const key in source) {
        const newVal = source[key]
        const oldVal = target[key]

        if (Array.isArray(newVal)) {
            Vue.set(target, key, [...newVal])
        } else if (
            newVal instanceof Date ||
            newVal === null ||
            newVal === undefined ||
            !isPlainObject(newVal)
        ) {
            Vue.set(target, key, newVal)
        } else if (isPlainObject(newVal) && isPlainObject(oldVal)) {
            deepMergeReactive(oldVal, newVal)
        } else {
            Vue.set(target, key, newVal)
        }
    }
}

const defaultEmptyHome = () => ({
    _id: null,
    title: '',
    description: '',
    note: '',
    pricePerNight: '',
    guests: 0,
    bedrooms: 0,
    beds: 0,
    bathrooms: 0,
    features: [],
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    lat: '',
    lng: '',
    images: []
})

export const state = () => defaultEmptyHome()

export const mutations = {
    setAll (state, payload) {
        deepMergeReactive(state, payload)
    },
    reset (state) {
        Object.assign(state, defaultEmptyHome())
    }
}

export const getters = {
    getAll: state => field => state[field],
    home (state) {
        return {
            _id: state._id,
            title: state.title,
            description: state.description,
            note: state.note,
            pricePerNight: state.pricePerNight,
            guests: state.guests,
            bedrooms: state.bedrooms,
            beds: state.beds,
            bathrooms: state.bathrooms,
            features: state.features,
            location: {
                address: state.address,
                city: state.city,
                state: state.state,
                postalCode: state.postalCode,
                country: state.country
            },
            _geoloc: {
                lat: state.lat,
                lng: state.lng
            },
            images: state.images
        }
    }
}

export const actions = {
    async fetchHome ({ commit }, id) {
        if (id === 'add') {
            commit('reset')
        } else {
            const home = await this.$api.$get(`/homes/${id}`)
            commit('setAll', {
                ...home,
                ...home.location,
                ...home._geoloc
            })
        }
    },

    async saveHome ({ commit, getters }) {
        const { _id, ...home } = getters.home
        const safehome = JSON.parse(JSON.stringify(home))

        delete safehome.owner

        if (_id) {
            const updated = await this.$api.$patch(`/homes/${_id}`, safehome)
            commit('setAll', updated)
            return updated
        } else {
            const created = await this.$api.$post('/homes', safehome)
            commit('setAll', created)
            return created
        }
    }
}
