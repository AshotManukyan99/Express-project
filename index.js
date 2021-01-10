const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
//Routes
const courses = require('./routes/courses')
const home = require('./routes/home')
const add = require('./routes/add')
const card = require('./routes/card')
const orders = require('./routes/orders')
//model
const User = require('./models/user')


const app = express()

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
})


app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(async (req, res, next) => {
    try {
        const user = await User.findById('5ff9f09e02ebdd1868f95547')
        req.user = user
        next()
    } catch (e) {
        console.error(e)
    }


})

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))

app.use('/courses', courses)
app.use('/', home)
app.use('/add', add)
app.use('/card', card)
app.use('/orders', orders)

const PORT = process.env.PORT || 3000
const password = 'LBM5EIt6t6cWrX3g'

async function start() {
    try {
        const url = `mongodb+srv://ashot:${password}@cluster0.c36ue.mongodb.net/shop`
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })
        const candidate = await User.findOne()
        if (!candidate) {
            const user = new User({
                email: 'ash1999_2011@mail.ru',
                name: 'Ashot',
                bag: {items: []}
            })
            await user.save()
        }
        app.listen(PORT, () => {
            console.log(`server is running on Port ${PORT} `)
        })
    } catch (e) {
        console.error(e)
    }
}

start().catch()


