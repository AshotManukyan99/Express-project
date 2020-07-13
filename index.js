const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')

const app = express()

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
})

app.engine('hbs' , hbs.engine)
app.set('view engine', 'hbs');
app.set( 'views' , 'views' )

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.status(200)
    res.render('index')
})


//<!-- sovorkan havayi zapros -->
app.get('/about', (req, res) => {
    res.render('about')
})



const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`server is runnig on Port ${PORT} `);
})