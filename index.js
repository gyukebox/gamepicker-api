const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2/promise');
const logger = require('morgan');

const games = require('./controller/games');
const users = require('./controller/users');
const posts = require('./controller/posts');
const tags = require('./controller/tags');
const platforms = require('./controller/platforms');
const auth = require('./controller/auth');
const manage = require('./controller/manage');
const admin = require('./controller/admin');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.get('/favicon.ico', (req, res) => {
    res.sendFile(__dirname + '/public/images/favicon.ico')
})
app.use(logger(':date :method :url :status :res[content-length] - :response-time ms'));
app.use((req, res, next) => {
    global.pool = mysql.createPool(require('./config/database'));
    next();
})
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use('/public', express.static(__dirname + '/public'))
app.use('/uploads', express.static(__dirname + '/uploads'))

const port = process.env.PORT || 80;

app.use('/games', games);
app.use('/users', users);
app.use('/posts', posts);
app.use('/tags', tags);
app.use('/platforms', platforms);
app.use('/auth', auth);
app.use('/manage', manage);
app.use('/admin', admin);
app.use('*', (req, res, next) => {
    res.status(404).send('Page Not Found');
})
app.use((err, req, res, next) => {    
    if (!err.status)
        console.error(err);
    res.status(err.status || 500).json({
        message: err.message
    })
})

app.listen(port);