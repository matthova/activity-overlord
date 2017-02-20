/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

const bcrypt = require('bcrypt');

function initializeAdminUser(cb) {
  User.find(function foundUsers(err, users) {
    if (err) {
      throw new Error(err);
    }
    if (users.length > 0) {
      return cb();
    }

    const adminProperties = {
      name: 'me',
      title: 'person',
      email: 'me@me.com',
      // What keeps anyone from creating an admin user via post?
      admin: true,
      password: 'password',
      confirmation: 'password',
    };

    bcrypt.hash('password', 10, function passwordEncrypted(err, encryptedPassword) {
      if (err) {
        return next(err);
      }

      adminProperties.encryptedPassword = encryptedPassword;

      User.create(adminProperties, function userCreated(err, user) {
        if (err) {
          throw new Error(JSON.stringify(err));
        }
        cb();
      });
    });
  });
}

module.exports.bootstrap = function(cb) {
  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  initializeAdminUser(cb);
};
