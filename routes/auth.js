const {Router} = require('express')
const bcrypt = require('bcryptjs')
//model
const User = require('../models/user')

const router = Router()

router.get('/login', async (req, res) => {

    res.render('auth/login', {
        title: 'Auth',
        isLogin: true,
        loginError: req.flash('login'),
        registerError: req.flash('register')
    })
})

router.get('/logout', async (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login')
    })
})

router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body
        const candidate = await User.findOne({email})

        if (candidate) {

            if (await bcrypt.compare(password, candidate.password)) {
                req.session.user = candidate
                req.session.isAuthenticated = true
                req.session.save((err) => {
                    if (err) {
                        throw err
                    }
                    res.redirect('/')
                })
            } else {
                req.flash('login', 'Invalid password')
                res.redirect('login')
            }

        } else {
            req.flash('login', 'no such user exists')
            res.redirect('login')
        }

    } catch (e) {
        console.error(e)
    }
})


router.post('/register', async (req, res) => {
    try {
        const {email, password, confirm, name} = req.body

        const candidate = await User.findOne({email})

        if (candidate) {
            req.flash('register', 'user with this email already exists')
            res.redirect('register')
        } else {
            const hashPassword = await bcrypt.hash(password, 10)
            const user = new User({
                email, password: hashPassword, name, bag: {items: []}
            })
            await user.save()
            res.redirect('login')
        }

    } catch (e) {
        console.error(e)
    }
})


module.exports = router

