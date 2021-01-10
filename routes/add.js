const {Router} = require('express')
const Course = require('../models/courses')

const router = Router()


router.get('/', (req, res) => {
    res.render('addCourses', {
        title: 'Courses',
        isCourses: true
    })
})


router.post('/', async (req, res) => {

    const course = new Course({
        name: req.body.name,
        price: req.body.price,
        url: req.body.url,
        userId: req.user
    })

    try {
        await course.save()
        res.redirect('/courses')
    } catch (e) {
        console.error(e)
    }
})


module.exports = router