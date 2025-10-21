const mongoose = require('mongoose')
const slugify = require('slugify')

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: String,
  password: { type: String, required: true },
  slug: { type: String, required: true, unique: true }
})

userSchema.pre('save', function(next) {
  if (this.isModified('slug')) {
    this.slug = slugify(this.slug, { lower: true, strict: true })
  }
  next()
})

module.exports = mongoose.models.User || mongoose.model('User', userSchema)
