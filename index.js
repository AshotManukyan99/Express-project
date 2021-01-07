const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
//Routes
const courses = require('./routes/courses')
const home = require('./routes/home')
const add = require('./routes/add')
const card = require('./routes/card')


const app = express()

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
})


app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))

app.use('/courses', courses)
app.use('/', home)
app.use('/add', add)
app.use('/card', card)


const url = 'mongodb+srv://ashot:3dz4Pj5eS6Oq2mTp>@cluster0.c36ue.mongodb.net/<dbname>?retryWrites=true&w=majority'

const PORT = process.env.PORT || 3000


app.listen(PORT, () => {
    console.log(`server is runnig on Port ${PORT} `)
})