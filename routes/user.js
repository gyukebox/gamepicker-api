const express = require('express');

const router = express.Router();
const jwt = require('jwt-simple');
const config = require('../config/jwt-config');

const Database = require('../model/Database');
const database = new Database();

const passport = require('passport');
const auth = require('./passport')

tokenToId = (token) => {
    const user = jwt.decode(token, config.jwtSecret);
    return user.id;
}

checkDuplicateData = (field, value) => {
    return new Promise((resolve, reject) => {
        const conn = mysql.createConnection(dbConfig);
        conn.query('SET NAMES utf8');
        const query = `SELECT EXIST (SELECT id FROM accounts WHERE ${field}=${value})`;
        conn.query(query, (err, rows) => {
            if(err)     reject(Error(`${value} at ${field} is duplicate`));
            else        resolve();
        });
    });
}
//login
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    database.query(`SELECT id, email, password FROM accounts WHERE email='${email}'`)
    .then(rows => {
        const user = rows[0];
        if(user) {
            if(user.password === password) {
                const payload = { id: user.id };
                const token = jwt.encode(payload, config.jwtSecret);
                res.status(200).json({token: token});
            } else {
                res.status(400).json({error : 'invalid password'})
            }
        } else {
            res.status(400).json({error : 'invalid email'})
        }
    }).catch(err => {
        res.status(400).json(err);
    })
})
/*
router.get('/secret', passport.authenticate(), (req, res) => {
    res.json(req.user);
})
*/
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
        database.count('email',email).then(() => {
            return database.count('name',name);
        }).then(() => {
            return database.query(`INSERT INTO accounts(name, email, password) VALUES ('${name}', '${email}', '${password}')`)
        }).then(() => {
            res.status(201).json({ success: 'register complete'});
        }).catch(err => {
            res.status(400).json(err);
        })        
    }
});

module.exports = router;