const { Router } = require('express')
const Cousres = require('../models/courses')

const router = Router()

router.get('/', async (req, res) => {
    const courses = await Cousres.getAll()
    res.render('contact', {
        title: 'contact',
        isContact: true,
        courses
    })
})


module.exports = router