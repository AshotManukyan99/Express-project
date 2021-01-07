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
    const course = new Course(req.body.name, req.body.price, req.body.url)

    await course.save()

    res.redirect('/courses')
})


module.exports = router