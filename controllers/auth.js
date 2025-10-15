const router = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')
const slugify = require('slugify')
//Routes/ API's/ controllers functions
router.get('/sign-up', (req, res) => {
  res.render('auth/sign-up.ejs')
})

router.post('/sign-up', async (req, res) => {
  try {
    const userInDatabase = await User.findOne({ username: req.body.username })
    if (userInDatabase) {
      return res.send('Username already taken')
    }

    if (req.body.password !== req.body.confirmPassword) {
      return res.send('Password and confirm password must match.')
    }
    // bcrypt for password encryption
    const hashedPassword = bcrypt.hashSync(req.body.password, 10)
    req.body.password = hashedPassword

  const slug = slugify(req.body.username, { lower: true })

    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      slug
    })

    res.send(`Thanks for signing up ${user.username}`)
  } catch (error) {
    console.log(error)
  }
})

router.get('/sign-in', (req, res) => {
  res.render('auth/sign-in.ejs')
})

router.post('/sign-in', async (req, res) => {
  const userInDatabase = await User.findOne({ username: req.body.username })
  if (!userInDatabase) {
    return res.send('login failed. Please try again later')
  }
  const validPassword = bcrypt.compareSync(
    req.body.password,
    userInDatabase.password
  )
  if (!validPassword) {
    return res.send('login failed. Please try again later')
  }

  // User exists and Password is valid.
  req.session.user = {
    username: userInDatabase.username,
    _id: userInDatabase._id
  }
  res.redirect('/')
})

router.get("/sign-out", (req, res) => {
  req.session.destroy();
  res.redirect("/");
})

router.get('/u/:slug', async (req, res) => {
  try {
    const user = await User.findOne({ slug: req.params.slug })
    if (!user) {
      return res.status(404).send('User not found')
    }

    res.render('auth/public-profile.ejs', { user })
  } catch (error) {
    console.log(error)
    res.status(500).send('Server error')
  }
})


module.exports = router
