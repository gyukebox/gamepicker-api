const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const session = require('express-session');
const passport = require('passport');
const passportConfig = require('./passport');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(cors());
app.use(session({ secret: '1234', resave: true, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());
passportConfig();

const port = process.env.PORT || 3333;

app.use('/users',require('./routes/user'));
app.use('/game',require('./routes/game'));

app.listen(port);
