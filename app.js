const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const path = require('path')
const passport = require('passport')
const MongoStore = require('connect-mongo')
const session = require('express-session')

//load config
dotenv.config({ path:'./config/config.env' })

//Passport config
require('./config/passport')(passport)

connectDB()

const app = express()

//logging
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}


//handlebars
app.engine('.hbs', exphbs.engine({
        defaultLayout: 'main', 
        extname: '.hbs'
    })
);
app.set('view engine', ".hbs")

//Session middleware
app.use(
    session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI
        })
        //cookie: { secure: true }//requires https
    })
)

//Passport middleware
app.use(passport.initialize())
app.use(passport.session())

//static folder
app.use(express.static(path.join(__dirname, 'public')))

//Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))

const PORT = process.env.PORT || 3000

app.listen(
    PORT,
    console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
    )