const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const passport = require('passport');
const auth = require('./routes/passport')();

const mysql = require('mysql');
const db_config = require('./config/db-config');

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

//time out 방지 코드
setInterval(() => {
  db.query('SELECT 1');
}, 20000);

//test code
app.get('/', (req, res) => {
    res.sendFile('./index.html', {root: __dirname});
});


app.listen(port);
