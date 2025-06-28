import bootstrapConfig from './config.js'
import dbConnection from './connectDb.js'
import getControllers from './controllers.js'

export async function bootstrapServer (options) {
    const config = bootstrapConfig(options)
    const dbClient = await dbConnection(config.paymentDb)
    const controllers = getControllers(config, dbClient)

    return { dbClient, controllers, config }
}
