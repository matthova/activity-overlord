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

      res.redirect('/user/show/' + user.id);
    });
  },

  show: (req, res, next) => {
    User.findOne(req.param('id'), function foundUser (err, user) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return next();
      }

      res.view({ user });
    });
  },

  index: (req, res, next) => {
    // Get an array of all users in the User collection(e.g. table)
    User.find(function foundUsers (err, users) {
      if (err) {
        return next(err);
      }
      res.view({ users });
    });
  },

  edit: (req, res, next) => {
    // Find the user from the id passed in via params
    User.findOne(req.param('id'), function foundUser (err, user) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return next('User doesn\'t exist.');
      }

      res.view({ user });
    });
  },

  update: (req, res, next) => {
    User.update(req.param('id'), req.params.all(), function userUpdated (err) {
      if (err) {
        return res.redirect('/user/edit/' + req.param('id'));
      }

      res.redirect('/user/show/' + req.param('id'));
    });
  },

  destroy: (req, res, next) => {
    User.findOne(req.param('id'), function foundUser (err, user) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return next('User doesn\'t exist.');
      }

      User.destroy(req.param('id'), function userDestroyed(err) {
        if (err) {
          return next(err);
        }
      });

      res.redirect('/user');
    });
  }
};

