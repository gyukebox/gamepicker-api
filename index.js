const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(cors());

const port = process.env.PORT || 3333;

app.use(passport.initialize());

app.use('/users', require('./routes/user'));
app.use('/games', require('./routes/game'));
app.use('/tags', require('./routes/tags'));
app.use('/platforms', require('./routes/platforms'));

app.listen(port);
