const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

app.use(cors());

const port = process.env.PORT || 3333;

app.use('/user',require('./routes/user'));
app.use('/account',require('./routes/account'));
app.use('/game',require('./routes/game'));

app.listen(port);
