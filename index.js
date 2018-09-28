const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const passport = require('passport');
const auth = require('./routes/passport')();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(cors());
app.use(auth.initialize());

const port = process.env.PORT || 3333;

app.use(passport.initialize());

app.use('/users', require('./routes/user'));
app.use('/games', require('./routes/game'));
app.use('/tags', require('./routes/tags'));
app.use('/platforms', require('./routes/platforms'));
app.use('/talks', require('./routes/talk'));

//test code
app.get('/', (req, res) => {
    res.send(`You are connected to the gamepicker API. For more information, go to <a href='https://github.com/ansrl0107/GamePickerAPI'>Here!</a>`)
});


app.listen(port);
