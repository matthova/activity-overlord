/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  new: (req, res) => {
    res.view();
  },
  create: (req, res, next) => {
    // Create a User with the params sent from
    // the sign-up form --> new.ejs
    User.create(req.params.all(), function userCreated(err, user) {

      // If there's an error
      // Redirect the user to the signup page
      if (err) {
        req.session.flash = { err };
        return res.redirect('/user/new');
      }

      res.json(user);
    });
  }
};

