/**
 * SessionController
 *
 * @module :: SessionController
 * @description :: Contains logic for handling requests.
 */

const bcrypt = require('bcrypt');

module.exports = {
  new: function(req, res) {
    res.view('session/new');
  },
  create: function(req, res, next) {
    // Check for email and password in params sent via the form
    // if none, redirect the browser back to the sign-in form
    if (!req.param('email') || !req.param('password')) {
      const usernamePasswordRequiredError = [{
        name: 'usernamePasswordRequired',
        message: 'You must enter both a username and password.',
      }];

      req.session.flash = {
        err: usernamePasswordRequiredError,
      };

      res.redirect('/session/new');
      return;
    }

    User.findOneByEmail(req.param('email'), function foundUser(err, user) {
      if (err) {
        return next(err);
      }

      // If no user found
      if (!user) {
        const noAccountError = [{
          name: 'noAccount',
          message: 'The email address ' + req.param('email') + ' not found.',
        }];
        req.session.flash = {
          err: noAccountError,
        };
        res.redirect('/session/new');
        return;
      }

      // Compare password from the form params to the encrypted password of the user found.
      bcrypt.compare(req.param('password'), user.encryptedPassword, function(err, valid) {
        if (err) {
          return next(err);
        }
        if (!valid) {
          const usernamePasswordMismatchError = [{
            name: 'usernamePasswordMismatch',
            message: 'Invalid username and password combination.',
          }];
          req.session.flash = {
            err: usernamePasswordMismatchError,
          };
          return;
        }

        // Log user in
        req.session.authenticated = true;
        req.session.User = user;

        // Change status to online
        User.update(user.id, { online: true }, function(err, updatedUser) {
          // If the user is also an admin, redirect to the user list
          // this is used in conjunction with config/policies.js file
          if (req.session.User.admin) {
            res.redirect('/user');
            return;
          }

          // Redirect to their profile page (e.g. /views/user/show.ejs)
          res.redirect('/user/show/' + updatedUser.id);
        });
      });
    });
  },
  destroy: function(req, res, next) {
    User.findOne(req.session.User.id, function foundUser (err, user) {
      var userId = req.session.User.id;

      // The user is "logging out" (e.g. destroying the session)
      // so change the online attribute to false
      User.update(userId, {
        online: false,
      }, function (err) {
        if (err) {
          return next(err);
        }

        // Wipe out the session (log out)
        req.session.destroy();

        // Redirect the browser to the sign-in screen
        res.redirect('/session/new');
      });
    });
  },
};
