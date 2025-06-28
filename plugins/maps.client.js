export default function ({ $config }, inject) {
    let isLoaded = false
    let waiting = []

    window.initGoogleMaps = init
    addScript()
    inject('maps', {
        showMap,
        makeAutoComplete
    })

    function addScript () {
        const script = document.createElement('script')
        script.src = `https://maps.googleapis.com/maps/api/js?key=${$config.map.key}&loading=async&libraries=places,marker&callback=initGoogleMaps`
        script.async = true
        document.head.appendChild(script)
    }

    function init () {
        isLoaded = true
        waiting.forEach((item) => {
            if (typeof item.fn === 'function') {
                item.fn(...item.arguments)
            }
        })
        waiting = []
    }

    function showMap (canvas, lat, lng, markers) {
        if (!isLoaded) {
            waiting.push({
                fn: showMap,
                arguments
            })
            return
        }

        const mapOptions = {
            zoom: 18,
            center: new window.google.maps.LatLng(lat, lng),
            disableDefaultUI: true,
            zoomControl: true,
            mapId: 'NUXT_APP_MAP'
        }

        const map = new window.google.maps.Map(canvas, mapOptions)
        if (!markers || markers.length === 0) {
            const position = new window.google.maps.LatLng(lat, lng)
            const basicMarker = document.createElement('i')
            basicMarker.className = 'v-icon large mdi mdi-map-marker primary--text'
            basicMarker.style['font-size'] = '42px'
            // eslint-disable-next-line no-new
            new window.google.maps.marker.AdvancedMarkerElement({
                map,
                position,
                content: basicMarker
            })
            return
        }

        const bounds = new window.google.maps.LatLngBounds()
        markers.forEach((home) => {
            const position = new window.google.maps.LatLng(home.lat, home.lng)
            const priceTag = document.createElement('div')
            priceTag.className = `marker home-${home.id}`
            priceTag.textContent = `$${home.pricePerNight}`
            // eslint-disable-next-line no-new
            new window.google.maps.marker.AdvancedMarkerElement({
                map,
                position,
                content: priceTag
            })
            bounds.extend(position)
        })

        map.fitBounds(bounds)
    }

    function makeAutoComplete (input, types = ['(cities)']) {
        if (!isLoaded) {
            waiting.push({
                fn: makeAutoComplete,
                arguments
            })
            return
        }
        const autoComplete = new window.google.maps.places.Autocomplete(input, { types })
        autoComplete.addListener('place_changed', () => {
            const place = autoComplete.getPlace()
            input.dispatchEvent(new CustomEvent('changed', {
                detail: place
            }))
        })
    }
}
