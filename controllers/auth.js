const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const User = require('../models/User')

// Sign-up form
router.get('/sign-up', (req, res) => {
  res.render('auth/sign-up')
})

// Sign-up post
router.post('/sign-up', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    })
    req.session.user = user
    res.redirect('/links')
  } catch (err) {
    console.error(err)
    res.redirect('/auth/sign-up')
  }
})

// Sign-in form
router.get('/sign-in', (req, res) => {
  res.render('auth/sign-in')
})

// Sign-in post
router.post('/sign-in', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username })
    if (!user) return res.redirect('/auth/sign-in')

    const valid = await bcrypt.compare(req.body.password, user.password)
    if (!valid) return res.redirect('/auth/sign-in')

    req.session.user = user
    res.redirect('/links')
  } catch (err) {
    console.error(err)
    res.redirect('/auth/sign-in')
  }
})

// Sign out
router.get('/sign-out', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/')
  })
})

module.exports = router
