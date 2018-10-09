const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const passport = require('passport');
const auth = require('./routes/passport')();

const Database = require('./model/Database');
const database = new Database();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(auth.initialize());

const port = process.env.PORT || 3333;

app.use('/users', require('./routes/user'));
app.use('/games', require('./routes/game'));
app.use('/tags', require('./routes/tags'));
app.use('/platforms', require('./routes/platforms'));
app.use('/talks', require('./routes/talk'));

//time out prevent code
setInterval(() => {
  database.query('SELECT 1');
}, 20000);

//test code
app.get('/', (req, res) => {
    res.sendFile('./index.html', {root: __dirname});
});


app.listen(port);
