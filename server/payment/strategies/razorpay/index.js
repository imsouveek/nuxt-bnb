import Razorpay from 'razorpay'
import dbModule from '../db.js'
import verifyModule from './verify.js'
import orderModule from './order.js'

export default (config) => {
    const razorpay = new Razorpay({
        key_id: config.razorpay.key_id,
        key_secret: config.razorpay.key_secret
    })

    return {
        name: 'Razorpay',
        db: dbModule('razorpay'),
        orderIdMatch: orderId => ({ razorpayOrderId: orderId }),
        verify: verifyModule(config.razorpay),
        order: orderModule(razorpay)
    }
}
