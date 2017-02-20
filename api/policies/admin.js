/**
 * Allow any authenticated user.
 */
module.exports = function (req, res, next) {

  // User is allowed, proceed to controller
  if (req.session.User && req.session.User.admin) {
    return next();
  }

  const requireAdminError = [{
    name: 'requireAdminError',
    message: 'You must be an admin.',
  }];

  req.session.flash = {
    err: requireAdminError,
  };

  res.redirect('/session/new');
  return;
}
