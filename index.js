const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const csrf = require('csurf')
const flash = require('connect-flash')
const cookieParser = require('cookie-parser')
const expHbs = require('express-handlebars')
const mongoose = require('mongoose')
const compression = require('compression')
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
//middleware
const varMiddleware = require('./middleware/variables')
const userMiddleware = require('./middleware/user')
const errorMiddleware = require('./middleware/error')
const fileMiddleware = require('./middleware/file')
//Routes
const courses = require('./routes/courses')
const home = require('./routes/home')
const add = require('./routes/add')
const card = require('./routes/card')
const orders = require('./routes/orders')
const auth = require('./routes/auth')
const profile = require('./routes/profile')
const keys = require('./keys/index')

const app = express()

const hbs = expHbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    helpers: require('./utils/hbs-helpers.js')
})

const store = new MongoStore({
    collection: 'session',
    uri: keys.MONGO_URL
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(session({
    secret: 'some secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: 'strict'
    },
    store
}))
app.use(express.static(path.join(__dirname, 'public')))
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use(express.urlencoded({extended: true}))
app.use(fileMiddleware.single('avatar'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser())
app.use(csrf({cookie: true}))
app.use(flash())
app.use(compression())
app.use(varMiddleware)
app.use(userMiddleware)


app.use('/courses', courses)
app.use('/', home)
app.use('/add', add)
app.use('/card', card)
app.use('/orders', orders)
app.use('/profile', profile)
app.use('/auth', auth)

app.use(errorMiddleware)

const PORT = process.env.PORT || 3000


async function start() {
    try {
        await mongoose.connect(keys.MONGO_URL, {
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

start()


