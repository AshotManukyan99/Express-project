const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')
const courses = require('./routes/courses')
const card = require('./routes/addCard')
const home = require('./routes/home')
const contact = require('./routes/contact')
const add = require('./routes/addCard')


const app = express()

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs');
app.set('views', 'views')

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use('/courses', courses)
app.use('/about', card)
app.use('/home', home)
app.use('/contact', contact)
app.use( '/add' , add )

app.get('/', (req, res) => {
    res.status(200)
    res.render('index', {
        title: 'Home',
    })
})


const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`server is runnig on Port ${PORT} `);
})