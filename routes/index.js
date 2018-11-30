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
    database.query(`SELECT id, password FROM accounts WHERE email=?`,[email])
    .then(check)
    .then(success)
    .catch(error);
})

router.get('/me', (req, res) => {
    const { decodeToken, success, error } = require('../model/common')(res);
    const query = (user_id) => {
        const sql = `
        SELECT 
            id,
            name,
            email, 
            password, 
            birthday, 
            gender, 
            IFNULL(introduce, "") AS introduce, 
            point, 
            (SELECT EXISTS(SELECT * FROM admin WHERE user_id = ?)) AS admin,
            (SELECT EXISTS(SELECT * FROM premium_accounts WHERE user_id = ?)) AS premium
        FROM accounts
        WHERE id = ?`
        return database.query(sql,[user_id, user_id, user_id]);
    }
    const singulation = (rows) => {
        return rows[0]
    }
    decodeToken(req).then(query).then(singulation).then(success).catch(error);
})

router.get('/tmp/games', (req, res) => {
    const { success, error } = require('../model/common')(res);
    const { limit, offset } = req.query;
    let sql = `
    SELECT 
        title, 
        (
            SELECT GROUP_CONCAT(tags.id)
            FROM game_tags
            LEFT JOIN tags
            ON tags.value = game_tags.tag
            WHERE game_id = games.id
        ) AS tag_id_list
    FROM games `
    if (limit) {
        sql += `LIMIT ${limit} `;
        if (offset)
            sql += `OFFSET ${offset}`
    }

    database.query(sql)
    .then(success).catch(error);
})

module.exports = router;