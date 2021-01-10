const {Router} = require('express')
const Course = require('../models/courses')

const router = Router()


router.get('/', async (req, res) => {
    const course = await Course.find()

    res.render('listCourses', {
        title: 'List Courses',
        isListCourses: true,
        course
    })
})


router.post('/remove', async (req, res) => {
    try {
        await Course.deleteOne({_id: req.body.id})
        res.redirect('/courses')
    } catch (e) {
        console.error(e)
    }
})


router.get('/:id/edit', async (req, res) => {
    if (!req.query.allow) {
        res.redirect('/')
    }
    const course = await Course.findById(req.params.id)
    const {name} = course
    res.render('courseEdit', {
        title: `Edit  ${name} `,
        course
    })
})


router.post('/edit', async (req, res) => {
    const {id} = req.body
    delete req.body.id
    await Course.findByIdAndUpdate(id, req.body)
    res.redirect('/courses')
})


router.get('/:id', async (req, res) => {
    const course = await Course.findById(req.params.id)
    const {name} = course
    res.render('course', {
        layout: 'empty',
        title: `Course ${name} `,
        course
    })

})

module.exports = router