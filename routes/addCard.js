const { Router } = require('express')
const router = Router()
const Course = require('../models/courses')



router.get('/', (req, res) => {
    res.render('courses', {
        title: 'About',
        isAbout: true
    })
})


router.post('/', (req, res) => {

    const courses = new Course(req.body.Name, req.body.Price, req.body.URL)
    courses.save()
    res.redirect('/contact')
})


module.exports = router