const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2/promise');
const moment = require('moment-timezone');
const logger = require('morgan');

const auth = require('./routes/auth');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use('/', express.static('apidoc'));
app.get('/favicon.ico', (req, res) => {
    res.sendFile(__dirname + '/public/images/favicon.ico')
})
app.use((req, res, next) => {
    global.pool = mysql.createPool(require('./config/database'));
    next();
})

logger.token('date', function() {
    const date = moment().tz('Asia/Seoul').format('MMM DD YYYY, hh:mm:ss');
    return date;
});
app.use(logger(':date :method :url :status - :response-time ms'));
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use('/auth', auth);
app.use('/', require('./routes/index'));
app.use('*', (req, res, next) => {
    next({status: 404, code: "ENDPOINT_NOT_FOUND", "message": "Endpoint not found"});
});
app.use((err, req, res, next) => {    
    const date = moment().tz('Asia/Seoul').format('MMM DD YYYY, hh:mm:ss');
    if (!err.status)
        console.error(date, err);
    const message = err.message;
    const code = err.code?err.code:"UNDEFINED_ERROR";
    res.status(err.status || 500).json({ code, message });
});

app.listen(process.env.PORT || 80);