const {Router} = require('express')

const router = Router()


router.get('/', (req, res) => {
    res.render('courses' , {
        title: 'Contact',
        isContact:true
    })
})

router.post( '/add' , (req,res) => {
    console.log(`Work`);
    console.log(res.body);
    res.s

    res.redirect('https://stackoverflow.com')

} )


module.exports = router