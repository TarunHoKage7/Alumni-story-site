const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const morgan = require('morgan')
const exphbs = require('express-handlebars')

//load config
dotenv.config({ path:'./config/config.env' })

connectDB()

const app = express()

//logging
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}


//handlebars
app.engine('.hbs', exphbs.engine({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', ".hbs")


//Routes

app.use('/', require('./routes/index'))

const PORT = process.env.PORT || 3000

app.listen(
    PORT,
    console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
    )