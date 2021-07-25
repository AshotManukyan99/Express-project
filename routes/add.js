const {Router} = require('express')
const Course = require('../models/courses')
const auth = require('../middleware/auth')
const router = Router()
const {courseValidators} = require('../utils/validators')
const {validationResult} = require('express-validator')

router.get('/', auth, (req, res) => {
    res.render('addCourses', {
        title: 'Courses',
        isCourses: true
    })
})

router.post('/', auth, courseValidators, async (req, res) => {
    const {body, user} = req
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(422).render('addCourses', {
            title: 'Courses',
            isCourses: true,
            error: errors.array()[0].msg,
            data: {
                name: body.name,
                price: body.price,
                url: body.url
            }
        })
    }

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
