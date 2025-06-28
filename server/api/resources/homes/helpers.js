export const validateOwnership = async (services, userId, homeId) => {
    const home = await services.home.get({ homeId }, { fieldList: 'owner' })
    if (!home) {
        throw new Error('Home not found')
    }
    if (!home.owner.equals(userId)) {
        throw new Error('Unauthorized')
    }
}
