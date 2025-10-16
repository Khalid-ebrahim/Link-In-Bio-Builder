const express = require('express')
const router = express.Router()
const Link = require('../models/Link')
const isSignedIn = require('../middleware/is-signed-in')

// Show all links
router.get('/', isSignedIn, async (req, res) => {
  const links = await Link.find({ user: req.session.user._id }).sort('order')
  res.render('links/index', { links })
})

// New link form
router.get('/new', isSignedIn, (req, res) => {
  res.render('links/new')
})

// Create new link
router.post('/', isSignedIn, async (req, res) => {
  await Link.create({
    title: req.body.title,
    url: req.body.url,
    user: req.session.user._id,
  })
  res.redirect('/links')
})

// Edit link form
router.get('/:id/edit', isSignedIn, async (req, res) => {
  const link = await Link.findById(req.params.id)
  res.render('links/edit', { link })
})

// Update link
router.put('/:id', isSignedIn, async (req, res) => {
  await Link.findByIdAndUpdate(req.params.id, req.body)
  res.redirect('/links')
})

// Delete link
router.delete('/:id', isSignedIn, async (req, res) => {
  await Link.findByIdAndDelete(req.params.id)
  res.redirect('/links')
})

module.exports = router
