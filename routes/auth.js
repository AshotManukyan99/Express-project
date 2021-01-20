const {Router} = require('express')
//model
const User = require('../models/user')

const router = Router()

router.get('/login', async (req, res) => {

    res.render('auth/login', {
        title: 'Auth',
        isLogin: true
    })
})

router.get('/logout', async (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login')
    })
})

router.post('/login', async (req, res) => {
    req.session.user = await User.findById('5ffc648a23577b0300bffcc1')
    req.session.isAuthenticated = true
    req.session.save((err) => {
        if (err) {
            throw err
        }
        res.redirect('/')
    })
})


router.post('/register', async (req, res) => {

    res.render('auth/login', {
        title: 'Register',
        isLogin: true
    })
})


module.exports = router

