/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  schema: true,
  attributes: {
    name: {
      type: 'string',
      required: true,
    },

    title: {
      type: 'string',
    },

    email: {
      type: 'string',
      email: true,
      unique: true,
      required: true,
    },

    encryptedPassword: {
      type: 'string',
      // required: true,
    },
    toJSON: function() {
      const obj = this.toObject();
      delete obj.password;
      delete obj.confirmation;
      delete obj.encryptedPassword;
      delete obj._csrf;
      return obj;
    },
  },
  beforeCreate: function(values, next) {
    // This checks to make sure the password and password confirmation match before creating record
    if (!values.password || values.password !== values.confirmation) {
      return next({ err: ['Password does not match password confirmation.'] });
    }

    require('bcrypt').hash(values.password, 10, function passwordEncrypted(err, encryptedPassword) {
      if (err) {
        return next(err);
      }

      values.encryptedPassword = encryptedPassword;
      next();
    });
  },
};

