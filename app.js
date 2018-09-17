const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const auth = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(cors());

const port = process.env.PORT || 3333;

app.use(express.static(path.json(__dirname, 'public')));
app.use(auth.initialize());

app.use('/users',require('./routes/user'));
app.use('/game',require('./routes/game'));

app.listen(port);
