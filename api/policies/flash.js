module.exports = function(req, res, next) {
  res.locals.flash = {};

  if (!req.session.flash) {
    return next();
  }

  // Assign flash values to the response
  res.locals.flash = _.clone(req.session.flash);
  // and then clear them from the request's session
  req.session.flash = {};

  next();
}
