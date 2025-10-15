const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const session = require('express-session')
const passUserToView = require('./middleware/pass-user-to-view')
const isSignIn = require('./middleware/is-signed-in')
const app = express()

const mongoose = require('mongoose')
const methodOverride = require('method-override')
const morgan = require('morgan')

const PORT = process.env.PORT ? process.env.PORT : '3000'

mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on('connected', () => {
  console.log(`connected to MongoDB Database: ${mongoose.connection.name}.`)
})

app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))
app.use(morgan('dev'))
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
  })
)
app.use(passUserToView)
//require controllers
const authCtrl = require('./controllers/auth')


//Use controller
app.use('/auth', authCtrl)

//Root Route
app.get('/', async (req, res) => {
  res.render('index.ejs')
})


app.listen(PORT, () => {
  console.log(`auth App is listening${PORT}`)
})
