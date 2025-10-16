const mongoose = require('mongoose')

const linkSchema = new mongoose.Schema({
  title: String,
  url: String,
  order: { type: Number, default: 0 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

module.exports = mongoose.models.Link || mongoose.model('Link', linkSchema)
