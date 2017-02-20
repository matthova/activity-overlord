/**
 * Allow a logged-in user to see, edit, and update their own profile
 * Allow admins to see everyone
 */
module.exports = function(req, res, next) {
  const sessionUserMatchesId = req.session.User && req.session.User.id === Number(req.param('id'));
  const isAdmin = req.session.User && req.session.User.admin;

  // The requested id does not match the user's id
  // and this is not an admin
  if (!(sessionUserMatchesId || isAdmin)) {
    const noRightsError = [{
      name: 'noRights',
      message: 'You must be an admin.',
    }];
    req.session.flash = {
      err: noRightsError,
    };
    res.redirect('/session/new');
    return;
  }
  next();
};
