const express = require('express');
const router = express.Router();
const jwt = require('jwt-simple');
const auth = require('./auth')();
const config = require('../config/jwt-config');

const mysql = require('mysql');
const dbConfig = require('../config/db-config');

router.post('/login', (req, res) => {
    if(req.body.email && req.body.password) {
        const email = req.body.email;
        const password = req.body.password;
        const conn = mysql.createConnection(dbConfig);
        const query = `SELECT id, email, password FROM accounts 
                        WHERE email=${email}, password=${password}`
        const user = conn.query(query, (err, rows) => {
            if(err)     console.log((err));
            else        return rows[0]
        });
        conn.end();
        if(user) {
            const payload = {
                id: user.id
            };
            const token = jwt.encode(payload, config.jwtSecret);
            res.json({
                token: token
            });
        } else {
            res.sendStatus(401);
        }
    } else {
        res.sendStatus(401);
    }
});

router.get('/token', auth.authenticate(), (req, res) => {
    res.send(req.user);
});

module.exports = router;