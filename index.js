const express = require('express')
const path = require('path')
const expHbs = require('express-handlebars')
const mongoose = require('mongoose')
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
//middleware
const varMiddleware = require('./middleware/variables')
const userMiddleware = require('./middleware/user')
//Routes
const courses = require('./routes/courses')
const home = require('./routes/home')
const add = require('./routes/add')
const card = require('./routes/card')
const orders = require('./routes/orders')
const auth = require('./routes/auth')

const MONGO_URL = `mongodb+srv://manukyan:cr7fanam7@cluster0.c36ue.mongodb.net/shop`

const app = express()

const hbs = expHbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
})

const store = new MongoStore({
    collection: 'session',
    uri: MONGO_URL
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(session({
    secret: 'some secret',
    resave: false,
    saveUninitialized: false,
    store
}))

app.use(varMiddleware)
app.use(userMiddleware)

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))

app.use('/courses', courses)
app.use('/', home)
app.use('/add', add)
app.use('/card', card)
app.use('/orders', orders)
app.use('/auth', auth)

const PORT = process.env.PORT || 3000


async function start() {
    try {
        await mongoose.connect(MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })
        app.listen(PORT, () => {
            console.log(`server is running on Port ${PORT} `)
        })
    } catch (e) {
        console.error(e)
    }
}

start().catch()


