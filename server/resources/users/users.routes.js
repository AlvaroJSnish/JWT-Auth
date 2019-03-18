const express = require('express');
const usersController = require('./users.controller');

const router = express.Router();

router.get('/users/', async (req, res) => {
  const user = await usersController.findByEmail(req.body);
  res.status(200).send({ data: user });
});

router.post('/users', async (req, res) => {
  const user = await usersController.createUser(req.body);
  res.status(201).send({ data: user });
});

module.exports = router;
