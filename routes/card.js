const {Router} = require('express')

//Models
const Course = require('../models/courses')
const router = Router()

const auth = require('../middleware/auth')


function mapCartItems(cart) {
    return cart.items.map(c => {
        const {_doc} = c.courseId
        return ({
            ..._doc,
            id: c.courseId._id,
            count: c.count
        })
    })
}

function computePrice(courses) {
    return courses.reduce((total, course) => {
        total += course.price * course.count
        return total
    }, 0)
}


router.post('/add', auth, async (req, res) => {
    const course = await Course.findById(req.body.id)
    await req.user.addToCart(course)
    res.redirect('/card')
})

router.delete('/remove/:id', auth, async (req, res) => {

    await req.user.removeFromCart(req.params.id)
    const {bag} = await req.user
        .populate('bag.items.courseId')
        .execPopulate()

    const cart = {
        courses: mapCartItems(bag),
        price: computePrice(mapCartItems(bag))
    }
    res.status(200).json(cart)
})


router.get('/', auth, async (req, res) => {

    const {bag} = await req.user
        .populate('bag.items.courseId')
        .execPopulate()

    const courses = mapCartItems(bag)

    res.render('card', {
        title: 'Card',
        isCard: true,
        courses: courses,
        price: computePrice(courses)
    })
})

module.exports = router