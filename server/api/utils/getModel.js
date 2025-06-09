export function getOrCreateModel(dbClient, name, schema) {
    const existing = dbClient.models[name]
    if (existing) {
        const a = Object.keys(existing.schema.paths).sort()
        const b = Object.keys(schema.paths).sort()
        const isSame = a.length === b.length && a.every((k, i) => k === b[i])
        if (!isSame) {
            throw new Error(`Model "${name}" already exists with a different schema.`)
        }
        return existing
    }
    return dbClient.model(name, schema)
}