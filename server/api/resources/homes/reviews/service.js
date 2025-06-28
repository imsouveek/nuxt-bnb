export default (models) => {
    async function getByHomeId (homeId, queryparams) {
        const { fieldList, options } = queryparams
        return await models.review.find({ homeId }, fieldList, options)
    }
    return {
        getByHomeId
    }
}
