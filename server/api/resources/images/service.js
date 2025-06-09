import validator from 'validator'

export default (models) => {

    async function getImage(id, queryparams) {
        const image = await models.image.findById(id.toString())

        if (!image) {
            throw new Error('No image found')
        }

        let imageData
        if (image.url) {
            imageData = await models.image.downloadImage(image.url)
        } else {
            imageData = image.imageData
        }

        const options = {}
        if (queryparams.options.width && queryparams.options.height) {
            options.width = queryparams.options.width
            options.height = queryparams.options.height
        }

        if (queryparams.fit) {
            options.options = {}
            options.options.fit = queryparams.fit
        }
        return await models.image.getModifiedImage(imageData, options)
    }

    async function setImage(imageInfo, tags = null, description = '') {
        let imageData, url
        if (validator.isURL(imageInfo, { protocols: ['http', 'https'] })) {
            url = imageInfo
        } else {
            if (imageInfo.startsWith('data:image')) {
                imageData = imageInfo
            } else {
                throw new Error('Invalid image data')
            }
        }
        const newImage = new models.image({
            imageData,
            url,
            tags,
            description
        })
        await newImage.save()
        return newImage
    }

    async function deleteImage(id) {
        await models.image.findByIdAndDelete(id.toString())
    }

    return {
        getImage,
        setImage,
        deleteImage
    }
}