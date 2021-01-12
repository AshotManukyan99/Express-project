const {Router} = require('express')

const router = Router()

router.get('/', async (req, res) => {

    res.render('login', {
        title: 'Auth',
        isLogin: true
    })
})

router.post('/login', async (req, res) => {

    console.log(req.body)

    res.render('login', {
        title: 'Login',
        isLogin: true
    })
})


router.post('/register', async (req, res) => {

    console.log(req.body)

    res.render('login', {
        title: 'Register',
        isLogin: true
    })
})


module.exports = router

