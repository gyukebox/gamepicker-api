const express = require('express');


const router = express.Router();
const jwt = require('jwt-simple');
const config = require('../config/jwt-config');

const mysql = require('mysql');
const dbConfig = require('../config/db-config');

router.get('/profile/:userName' ,(req, res) => {
    const user_name = req.query.name;
    const conn = mysql.createConnection(dbConfig);
    const query =`  SELECT id, name, email, birthday, gender, introduce, point
                    FROM accounts WHERE name=${user_name}`
    conn.query('SET NAMES utf8');
    conn.query(query, (err, rows) => {
        if(err)     console.log(err);
        else        res.json(rows[0]);
    });
})

router.post('/profile', (req, res) => {
    const token = req.body.token;
    const { name, password, birthday, gender, introduce } = req.body.data;
    const id = jwt.decode(token, config.jwtSecret);
    const conn = mysql.createConnection(dbConfig);
    const query =`  UPDATE accounts 
    SET name=${name}, password=${password}, birthday=${birthday}, gender=${gender}, introduce=${introduce}
    WHERE id=${id}`;
    //변경하기전에 name 중복여부 확인 필요함
    const exception_query = `SELECT EXIST (SELECT * FROM accounts WHERE name=${name}) as success`;
    conn.query('SET NAMES utf8');
    conn.query(exception_query, (err, rows) => {
        if(rows[0] === 0) {
            res.json(400, { error: `${name} is already exist`});
        } else {
            conn.query(query, (err, rows) => {
                if(err)     console.log(err);
                else        res.json(rows[0]);
            });
        }
    });


})

router.get('/profile', (req, res) => {
    const token = req.body.token;
    const id = jwt.decode(token, config.jwtSecret);
    const conn = mysql.createConnection(dbConfig);
    conn.query('SET NAMES utf8');
    const query = ` SELECT id, name, email, birthday, gender, introduce, point
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
        res.json(400, { error: 'lack of input'})
    } else {
        const name_dupl_query = `SELECT EXIST (SELECT id FROM accounts WHERE name=${name}`;
        const email_dupl_query = `SELECT EXIST (SELECT id FROM accounts WHERE name=${email}`;
        //FIXME: name, email 중복 체크 해야함 
        const now = new Date().toLocaleString();
        const conn = mysql.createConnection(dbConfig);
        conn.query('SET NAMES utf8');
        const query = `INSERT INTO accounts(email, password, point, login_date, create_date, update_date)
                        VALUES ('${email}', '${password}', '0', '${now}', '${now}', '${now}')`;
        conn.query(query, (err, rows) => {
            if(err)     console.log(err);
            else        res.json(201, { success: 'register complete'});
        });
        conn.end();
    }
})

/*
/profile/:userName

*/

module.exports = router;