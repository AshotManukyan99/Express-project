const {Router} = require('express')
const Course = require('../models/courses')

const router = Router()


router.get('/', async (req, res) => {
    const course = await Course.getAll()
    res.render('listCourses', {
        title: 'List Courses',
        isListCourses: true,
        course
    })
})


router.get('/:id/edit', async (req, res) => {
    if (!req.query.allow) {
        res.redirect('/')
    }
    const course = await Course.getById(req.params.id)

    res.render('courseEdit', {
        title: `Edit  ${course.name} `,
        course
    })
})


router.post('/edit', async (req, res) => {
    await Course.update(req.body)
    res.redirect('/courses')
})


router.get('/:id', async (req, res) => {
    const course = await Course.getById(req.params.id)
    res.render('course', {
        layout: 'empty',
        title: `Course ${course.name} `,
        course
    })
})

module.exports = router