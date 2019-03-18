/* eslint-disable space-before-function-paren */
/* eslint-disable func-names */
/* eslint-disable consistent-return */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const user = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

user.pre('save', function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  bcrypt.hash(this.password, 8, (err, hash) => {
    if (err) {
      return next(err);
    }

    this.password = hash;
    next();
  });
});

user.methods.checkPassword = function(password) {
  const passwordHash = this.password;
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, passwordHash, (err, same) => {
      if (err) {
        return reject(err);
      }

      resolve(same);
    });
  });
};

const User = mongoose.model('user', user);

module.exports = User;
