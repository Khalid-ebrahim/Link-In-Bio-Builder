module.exports = (req, res, next) => {
  // Use optional chaining to prevent error if req.session is undefined
  res.locals.user = req.session?.user || null
  next()
}