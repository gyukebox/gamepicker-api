const express = require('express');

const router = express.Router();
const jwt = require('jwt-simple');
const config = require('../config/jwt-config');

const mysql = require('mysql');
const dbConfig = require('../config/db-config');

tokenToId = (token) => {
    const user = jwt.decode(token, config.jwtSecret);
    return user.id;
}

checkDuplicateData = (field, value) => {
    return new Promise((resolve, reject) => {
        const conn = mysql.createConnection(dbConfig);
        conn.query('SET NAMES utf8');
        const query = `SELECT EXIST (SELECT id FROM accounts WHERE ${field}=${value}`;
        conn.query(query, (err, rows) => {
            if(err)     reject(Error(`${value} at ${field} is duplicate`));
            else        resolve();
        });
    });
}
//login
router.post('/login', (req, res) => {
    if(req.body.email && req.body.password) {
        const email = req.body.email;
        const password = req.body.password;
        const conn = mysql.createConnection(dbConfig);
        conn.query('SET NAMES utf8');
        const query = `SELECT id, email, password FROM accounts WHERE email='${email}'`
        conn.query(query, (err, rows) => {
            if(err)         res.json(400, { error: 'DATABASE error' })
            const user = rows[0];
            if(user) {
                if(user.password === password) {
                    const payload = {
                        id: user.id
                    };
                    const token = jwt.encode(payload, config.jwtSecret);
                    res.json(200, { token: token });
                } else {
                    res.json(400, { error: 'wrong password' });
                }
            } else {
                res.json(400, { error: 'email not found' })
            } 
        });
    } else {
        res.json(400, { error: 'lack of input' });
    }
})
//get userName's profile
router.get('/:userName' ,(req, res) => {
    const user_name = req.query.name;
    const conn = mysql.createConnection(dbConfig);
    const query =`  SELECT id, name, email, birthday, gender, introduce, point
                    FROM accounts WHERE name=${user_name}`
    conn.query('SET NAMES utf8');
    conn.query(query, (err, rows) => {
        if(err)     res.json(400, { error: 'DATABASE error'});
        else        res.json(rows[0]);
    });
})
//profile modify
router.post('/', (req, res) => {
    const token = req.body.token;
    const { name, password, birthday, gender, introduce } = req.body.data;
    const id = jwt.decode(token, config.jwtSecret);
    const conn = mysql.createConnection(dbConfig);
    conn.query('SET NAMES utf8');
    checkDuplicateData()
    .then(() => {
        const query =`  UPDATE accounts 
        SET name=${name}, password=${password}, birthday=${birthday}, gender=${gender}, introduce=${introduce}
        WHERE id=${id}`;
        conn.query(query, (err, rows) => {
            if(err)     res.json(400, { error: 'DATABASE error'});
            else        res.json(rows[0]);
        });
    }, (error) => {
        res.json(400, { error: error});
    })
});
//get profile
router.get('/', (req, res) => {
    const token = req.body.token;
    const id = jwt.decode(token, config.jwtSecret);
    const conn = mysql.createConnection(dbConfig);
    conn.query('SET NAMES utf8');
    const query = ` SELECT id, name, email, birthday, gender, introduce, point
                    FROM accounts
                    WHERE id=${id}`;
    conn.query(query, (err, rows) => {
        if(err)     res.json(400, { error: 'DATABASE error'});
        else        res.json(rows[0]);
    });
});
//register
router.put('/',(req, res) => {
    const { name, email, password } = req.body;
    if(!(name && email && password))    res.json(400, { error: 'lack of input'})
    else {
        const now = new Date().toLocaleString();
        const conn = mysql.createConnection(dbConfig);
        conn.query('SET NAMES utf8');
        checkDuplicateData('email',email)
        .then(() => {
            checkDuplicateData('name',name)
            .then(() => {
                const query = `INSERT INTO accounts(email, password, point, login_date, create_date, update_date)
                        VALUES ('${email}', '${password}', '0', '${now}', '${now}', '${now}')`;
                conn.query(query, (err) => {
                    if(err)     res.json(400, { error: 'DATABASE error' });
                    else        res.json(201, { success: 'register complete'});
                });
            }, (error) => res.json(400, { error: error }));
        }, (error) => res.json(400, { error: error }));
    }
});

module.exports = router;