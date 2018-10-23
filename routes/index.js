const express = require('express');
const router = express.Router();
const database = require('../model/pool');
const config = require('../config/jwt-config');
const jwt = require('jwt-simple');

router.post('/login', (req, res) => {
    const { success, error } = require('../model/common')(res);
    const { email, password } = req.body;
    const check = (rows) => {
        if (rows.length === 0) {
            throw 'email is invalid';
        } else if (rows[0].password !== password) {
            throw 'password is invalid'
        } else {
            const payload = { id: rows[0].id }
            const token = jwt.encode(payload, config.jwtSecret);
            return token;
        }
    }
    database.query(`SELECT id, password FROM accounts WHERE email='${email}'`)
    .then(check)
    .then(success)
    .catch(error);
})

router.get('/me', (req, res) => {
    const { decodeToken, success, error } = require('../model/common')(res);
    const query = (user_id) => {
        const sql = `
        SELECT name, email, password, birthday, gender, introduce, point
        FROM accounts
        WHERE id = '${user_id}'`
        return database.query(sql);
    }
    const singulation = (rows) => {
        return rows[0]
    }
    decodeToken(req).then(query).then(singulation).then(success).catch(error);
})

module.exports = router;