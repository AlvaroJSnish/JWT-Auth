const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('./users/users.model');

const newToken = (user) => {
  return jwt.sign({ id: user.id }, config.secrets.jwt, {
    expiresIn: config.secrets.jwtExp,
  });
};

const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line consistent-return
    jwt.verify(token, config.secrets.jwt, (err, payload) => {
      if (err) return reject(err);
      resolve(payload);
    });
  });
};

const signup = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({ message: 'need email and password' });
  }

  try {
    const user = await User.create(req.body);
    const token = newToken(user);
    return res.status(201).send({ token });
  } catch (e) {
    return res.status(500).end();
  }
};

// eslint-disable-next-line consistent-return
const signin = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({ message: 'The email and the password its required!' });
  }

  const invalid = { message: 'Invalid credentials' };

  try {
    const user = await User.findOne({ email: req.body.email })
      .select('email password')
      .exec();

    if (!user) {
      return res.status(401).send(invalid);
    }

    const match = await user.checkPassword(req.body.password);

    if (!match) {
      return res.status(401).send(invalid);
    }

    const token = newToken(user);
    return res.status(201).send({ token });
  } catch (e) {
    res.status(500).end();
  }
};

// eslint-disable-next-line consistent-return
const protect = async (req, res, next) => {
  const bearer = req.headers.authorization;

  if (!bearer || !bearer.startsWith('Bearer ')) {
    return res.status(401).end();
  }

  const token = bearer.split('Bearer ')[1].trim();
  let payload;
  try {
    payload = await verifyToken(token);
  } catch (e) {
    return res.status(401).end();
  }

  const user = await User.findById(payload.id)
    .select('-password')
    .lean()
    .exec();

  if (!user) {
    return res.status(401).end();
  }

  req.user = user;
  next();
};

module.exports = {
  newToken,
  verifyToken,
  signin,
  signup,
  protect,
};
