const express = require('express');
const router = express.Router();
const jwt = require('jwt-simple');
const config = require('../config/jwt-config');

const mysql = require('mysql');
const dbConfig = require('../config/db-config');

router.get('/profile', (req, res) => {
    const token = req.body.token;
    const id = jwt.decode(token, config.jwtSecret);
    const conn = mysql.createConnection(dbConfig);
    const query = ` SELECT id, email, birthday, gender, introduce, point
                    FROM accounts
                    WHERE id=${id}`;
    conn.query(query, (err, rows) => {
        if(err)     console.log(err);
        else        res.json(rows[0]);
    });
});

router.put('/',(req, res) => {
    const { name, email, password } = req.body;
    if(!(name && email && password)) {
        res.sendStatus(400)
    } else {
        const now = new Date().toLocaleString();
        const conn = mysql.createConnection(dbConfig);
        const query = `INSERT INTO accounts(email, password, point, login_date, create_date, update_date)
                        VALUES ('${email}', '${password}', '0', '${now}', '${now}', '${now}')`;
        conn.query(query, (err, rows) => {
            if(err)     console.log(err);
            else        res.sendStatus(201);
        });
        conn.end();
    }
})


module.exports = router;