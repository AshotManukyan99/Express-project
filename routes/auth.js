const {Router} = require('express')

const router = Router()

router.get('/login', async (req, res) => {

    res.render('auth/login', {
        title: 'Auth',
        isLogin: true
    })
})

router.post('/login', async (req, res) => {


    res.render('auth/login', {
        title: 'Login',
        isLogin: true
    })
})

    
router.post('/register', async (req, res) => {


    res.render('auth/login', {
        title: 'Register',
        isLogin: true
    })
})


module.exports = router

