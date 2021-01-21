const {Router} = require('express')
const Course = require('../models/courses')
const auth = require('../middleware/auth')
const router = Router()


router.get('/', auth, (req, res) => {
    res.render('addCourses', {
        title: 'Courses',
        isCourses: true
    })
})

router.post('/', auth, async (req, res) => {

    const {body, user} = req

    const course = new Course({
        name: body.name,
        price: body.price,
        url: body.url,
        userId: user
    })

    try {
        await course.save()
        res.redirect('/courses')
    } catch (e) {
        console.error(e)
    }
})


module.exports = router