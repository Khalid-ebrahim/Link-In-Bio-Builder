const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const session = require('express-session')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const morgan = require('morgan')

const passUserToView = require('./middleware/pass-user-to-view')

// Controllers
const authCtrl = require('./controllers/auth')
const linksCtrl = require('./controllers/links')

// Models
const User = require('./models/User')
const Link = require('./models/Link')

const app = express()

app.use(express.static('Styling'))

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on('connected', () => {
  console.log(`✅ Connected to MongoDB: ${mongoose.connection.name}`)
})

// Middleware
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(methodOverride('_method'))
app.use(morgan('dev'))
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: true,
  })
)
app.use(passUserToView)

// View engine
app.set('view engine', 'ejs')

// Routes
app.use('/auth', authCtrl)
app.use('/links', linksCtrl)

// Root route
app.get('/', (req, res) => {
  res.render('index')
})

// Public profile page
app.get('/u/:slug', async (req, res) => {
  try {
    const user = await User.findOne({ slug: req.params.slug })
    if (!user) return res.status(404).send('User not found')

    const links = await Link.find({ user: user._id }).sort('order')
    res.render('auth/public-profile', { user, links })
  } catch (error) {
    console.error(error)
    res.status(500).send('Server error')
  }
})

const PORT = process.env.PORT || 3000
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`))
}

module.exports = app
