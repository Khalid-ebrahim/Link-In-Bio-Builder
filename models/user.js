const mongoose = require('mongoose')
const slugify = require('slugify')

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: String,
  password: { type: String, required: true },
  slug: { type: String, unique: true }
})

userSchema.pre('save', function(next) {
  if (!this.isModified('username')) return next()
  this.slug = slugify(this.username, { lower: true, strict: true })
  next()
})

module.exports = mongoose.models.User || mongoose.model('User', userSchema)
