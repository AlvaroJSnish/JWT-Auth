const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');

const { signin, signup, protect } = require('./resources/auth');

const userRouter = require('./resources/users/users.routes');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));

// routes
app.post('/signup', signup);
app.post('/signin', signin);

app.use('/api', protect);
app.use('/api', userRouter);

app.listen(3000, () => {
  mongoose.connect('mongodb://localhost:27017/medium-auth');
});
