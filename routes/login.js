const express = require('express');
const router = express.Router();
const jwt = require('jwt-simple');
const auth = require('./auth')();
const config = require('../config/jwt-config');
const passport = require('passport');

const mysql = require('mysql');
const dbConfig = require('../config/db-config');

router.post('/', (req, res) => {
    if(req.body.email && req.body.password) {
        const email = req.body.email;
        const password = req.body.password;
        const conn = mysql.createConnection(dbConfig);
        conn.query('SET NAMES utf8');
        const query = `SELECT id, email, password FROM accounts WHERE email='${email}'`
        conn.query(query, (err, rows) => {
            if(err)         console.log(err);
            const user = rows[0];
            if(user) {
                if(user.password === password) {
                    const payload = {
                        id: user.id
                    };
                    const token = jwt.encode(payload, config.jwtSecret);
                    res.json({
                        token: token
                    });
                } else {
                    res.json({
                        error: 'wrong password'
                    });
                }
            } else {
                res.json({
                    error: 'email not found'
                })
            } 
        });
        conn.end();
    } else {
        res.sendStatus(400);
    }
});

router.get('/info', passport.authenticate('jwt', {session: false}), (req, res) => {
    res.send(req.user.profile);
});

module.exports = router;