const {Router} = require('express')
const Course = require('../models/courses')
const {courseValidators} = require('../utils/validators')
const {validationResult} = require('express-validator')
const router = Router()


function isOwner(courses, req) {
    return courses.userId.toString() === req.user._id.toString()
}

router.get('/', async (req, res) => {
    try {
        const course = await Course.find()

        res.render('listCourses', {
            title: 'List Courses',
            isListCourses: true,
            userId: req.user ? req.user._id.toString() : null,
            course
        })
    } catch (e) {
        console.log(e)
    }
})

router.post('/remove', async (req, res) => {
    try {
        await Course.deleteOne({_id: req.body.id})
        res.redirect('/courses')
    } catch (e) {
        console.error(e)
    }
})

router.get('/:id/edit', courseValidators, async (req, res) => {

    if (!req.query.allow) {
        res.redirect('/')
    }

    try {
        const course = await Course.findById(req.params.id)
        const {name} = course

        if (!isOwner(course, req)) {
            res.redirect('/courses')
        }

        res.render('courseEdit', {
            title: `Edit  ${name} `,
            course
        })
    } catch (e) {
        console.log(e)
    }
})

router.post('/edit', async (req, res) => {

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(422).redirect(`/courses/${req.body.id}/edit?allow=true`)
    }

    try {
        const {id} = req.body
        delete req.body.id
        await Course.findByIdAndUpdate(id, req.body)
        res.redirect('/courses')
    } catch (e) {
        console.log(e)
    }
})

router.get('/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
        const {name} = course
        res.render('course', {
            layout: 'empty',
            title: `Course ${name} `,
            course
        })
    } catch (e) {
        console.log(e)
    }
})

module.exports = router
