const User = require('./users.model');

const findByEmail = ({ email }) => {
  return User.findOne({ email })
    .lean()
    .exec();
};

const createUser = ({ email, password }) => {
  return User.create({ email, password });
};

module.exports = {
  findByEmail,
  createUser,
};
