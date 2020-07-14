const {Router} = require('express')

const router = Router()



//<!-- sovorkan havayi zapros -->
router.get('/', (req, res) => {
    res.render('card' , {
        title: 'home',
        isHome:true
    })
})


module.exports = router