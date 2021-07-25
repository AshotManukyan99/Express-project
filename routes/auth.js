const {Router} = require('express')
const bcrypt = require('bcryptjs')
const sgMail = require('@sendgrid/mail')
const keys = require('../keys/index')
const crypto = require('crypto')
const msg = require('../emails/registration')
const resetEmail = require('../emails/reset')
const {validationResult} = require('express-validator')
const {registerValidators} = require('../utils/validators')
//model
const User = require('../models/user')


const router = Router()

sgMail.setApiKey(keys.SEND_GRID_API_KEY)

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

router.post('/register', registerValidators, async (req, res) => {
    try {
        const {email, password, name} = req.body

        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            req.flash('register', errors.array()[0].msg)
            return res.status(422).redirect('/auth/login#register')
        }

        const hashPassword = await bcrypt.hash(password, 10)
        const user = new User({
            email,
            password: hashPassword,
            name,
            bag: {items: []}
        })
        await user.save()
        res.redirect('login')
        await sgMail.send(msg(email))

    } catch (e) {
        console.error(e)
    }
})

router.get('/reset', (req, res) => {

    res.render('auth/reset', {
        title: 'Reset Password',
        error: req.flash('error')
    })
})

router.post('/reset', (req, res) => {
    try {
        crypto.randomBytes(32, async (err, buf) => {
            if (err) {
                req.flash('error', 'Something went wrong. Please try again later.')
                return res.redirect('/auth/reset')
            }

            const token = buf.toString('hex')
            const candidate = await User.findOne({email: req.body.email})

            if (candidate) {
                candidate.resetToken = token
                candidate.resetTokenExp = Date.now() + 60 * 60 * 1000
                await candidate.save()
                await sgMail.send(resetEmail(candidate.email, token))
                return res.redirect('/auth/login')
            } else {
                req.flash('error', 'there is no such email')
                res.redirect('/auth/reset')
            }

        })

    } catch (e) {
        console.log(e)
    }
})

router.get('/password/:token', async (req, res) => {

    if (!req.params.token) {
        return res.redirect('/auth/login')
    }

    try {
        const user = await User.findOne({
            resetToken: req.params.token,
            resetTokenExp: {$gt: Date.now()}
        })

        if (!user) {
            return res.redirect('/auth/login')
        } else {
            res.render('auth/password', {
                title: 'Reset Password',
                error: req.flash('error'),
                userId: user._id.toString(),
                token: req.params.token
            })
        }

    } catch (e) {
        console.log(e)
    }

})

router.post('/password', async (req, res) => {
    try {
        const user = await User.findOne({
            _id: req.body.userId,
            resetToken: req.body.token,
            resetTokenExp: {$gt: Date.now()}
        })

        if (user) {
            user.password = await bcrypt.hash(req.body.password, 10)
            user.resetToken = undefined
            user.resetTokenExp = undefined
            await user.save()
            return res.redirect('/auth/login')
        } else {
            req.flash('loginError', 'token expired')
            return res.redirect('/auth/login')
        }

    } catch (e) {
        console.log(e)
    }
})

module.exports = router

