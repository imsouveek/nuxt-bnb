export default (gatewayName) => {
    const select = obj => ({
        [gatewayName]: obj ? { ...obj } : true
    })

    const create = obj => ({
        [gatewayName]: {
            create: {
                ...obj
            }
        }
    })

    const update = obj => ({
        [gatewayName]: {
            update: {
                data: {
                    ...obj
                }
            }
        }
    })

    const find = (dbClient, obj) => {
        return dbClient[gatewayName].findFirst({
            where: { ...obj }
        })
    }

    return {
        select,
        create,
        update,
        find
    }
}
