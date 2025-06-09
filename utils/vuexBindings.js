function writableField(module, field) {
    return {
        get() {
            return this.$store.getters[`${module}/getAll`](field)
        },
        set(value) {
            this.$store.commit(`${module}/setAll`, { [field]: value })
        }
    }
}

export function mapWritableFields(module, fields) {
    return Object.fromEntries(
        fields.map(field => [field, writableField(module, field)])
    )
}
