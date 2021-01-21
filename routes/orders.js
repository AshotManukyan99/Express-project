const {Router} = require('express')
const Order = require('../models/order')

const router = Router()

const auth = require('../middleware/auth')


function mapOrders(orders) {
    return orders.map(({_doc, courses}) => ({
        ...(_doc),
        price: courses.reduce((acc, curr) => {
            acc += curr.count * curr.course.price
            return acc
        }, 0)
    }))
}


router.get('/', auth, async (req, res) => {
    try {
        const orders = await Order.find({'user.userId': req.user._id})
            .populate('user.userId')

        res.render('orders', {
            isOrder: true,
            title: 'Order',
            orders: mapOrders(orders)
        })

    } catch (e) {
        console.error(e)
    }
})


router.post('/', auth, async (req, res) => {
    try {
        const user = await req.user
            .populate('bag.items.courseId')
            .execPopulate()

        const {bag} = user

        const courses = bag.items.map(i => {
            const {_doc} = i.courseId
            return ({
                count: i.count,
                course: {..._doc}
            })
        })

        const order = new Order({
            courses: courses,
            user: {
                name: req.user.name,
                userId: req.user
            }
        })

        await order.save()
        await req.user.clearBag()

        res.redirect('/orders')

    } catch (e) {
        console.error(e)
    }
})

module.exports = router