export default (gatewayName) => {
    const select = (obj) => ({
        [gatewayName]: obj ? { ...obj } : true
    })

    const where = (obj) => ({
        [gatewayName]: { ...obj }
    })

    const create = (obj) => ({
        [gatewayName]: {
            create: {
                ...obj
            }
        }
    })

    const update = (obj) => ({
        [gatewayName]: {
            update: {
                data: {
                    ...obj
                }
            }
        }
    })

    const find = async (dbClient, obj, findFirst = false) => {
        if (findFirst) {
            return dbClient[gatewayName].findFirst({
                where: { ...obj }
            })
        } else {
            return dbClient[gatewayName].findMany({
                where: { ...obj }
            })
        }
    }

    return {
        select,
        where,
        create,
        update,
        find
    }
}
