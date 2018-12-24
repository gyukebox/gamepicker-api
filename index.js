const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const games = require('./controller/games');
const users = require('./controller/users');
const posts = require('./controller/posts');
const tags = require('./controller/tags');
const platforms = require('./controller/platforms');
const auth = require('./controller/auth');
const manage = require('./controller/manage');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use('/public', express.static(__dirname + '/public'))

const port = process.env.PORT || 80;

process.on('uncaughtException', (err) => {
    console.log(err);
})

app.use('/games', games);
app.use('/users', users);
app.use('/posts', posts);
app.use('/tags', tags);
app.use('/platforms', platforms);
app.use('/auth', auth);
app.use('/manage', manage);

app.listen(port);