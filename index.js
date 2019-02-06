const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2/promise');
const logger = require('morgan');

const games = require('./routes/games');
const users = require('./routes/users');
const posts = require('./routes/posts');
const tags = require('./routes/tags');
const platforms = require('./routes/platforms');
const auth = require('./routes/auth');
const manage = require('./routes/manage');
const admin = require('./routes/admin');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.get('/favicon.ico', (req, res) => {
    res.sendFile(__dirname + '/public/images/favicon.ico')
})
app.use((req, res, next) => {
    global.pool = mysql.createPool(require('./config/database'));
    next();
})
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use('/public', express.static(__dirname + '/public'))
app.use('/uploads', express.static(__dirname + '/uploads'))
app.use('/manage', manage);
app.use(async (req, res, next) => {
    const auth_token = req.headers['authorization'];
    try {
        if (!auth_token) {
            throw { status: 400, message: "Authorization token required" };
        }
        const [rows] = await pool.query(`SELECT 1 FROM authorization WHERE token = ?`, [auth_token]);
        if (rows.length === 0)
            throw { status: 401, message: 'Authorization failed'};
        next();
    } catch (err) {
        next(err);
    }
})
app.use(logger(':date :method :url :status :res[content-length] - :response-time ms'));
const port = process.env.PORT || 80;

app.use('/games', games);
app.use('/users', users);
app.use('/posts', posts);
app.use('/tags', tags);
app.use('/platforms', platforms);
app.use('/auth', auth);
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