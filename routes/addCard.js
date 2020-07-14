const { Router } = require('express')
const data = require('../data/json.json')

const router = Router()


router.get('/', (req, res) => {
    res.render('courses', {
        title: 'About',
        isAbout: true
    })
})


router.post('/', (req, res) => {

    console.log(req.body)
    res.redirect('/contact')
})


module.exports = router