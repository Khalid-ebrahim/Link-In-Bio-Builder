const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const session = require('express-session')
const passUserToView = require('./middleware/pass-user-to-view')
const isSignIn = require('./middleware/is-signed-in')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const morgan = require('morgan')
const authCtrl = require('./controllers/auth')

const app = express()

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB: ${mongoose.connection.name}`)
})

// Middleware
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

// Set view engine
app.set('view engine', 'ejs')

// Controllers
app.use('/auth', authCtrl)

// Root route
app.get('/', (req, res) => {
  res.render('index') // make sure index.ejs exists in views/
})

// Only listen locally
const PORT = process.env.PORT || 3000
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`Auth App listening at http://localhost:${PORT}`)
  })
}

// Export for Vercel
module.exports = app
