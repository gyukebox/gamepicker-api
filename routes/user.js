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
                res.status(200).json({ success: true, token: token});
            } else {
                res.status(400).json({ success: false, message : 'invalid password'})
            }
        } else {
            res.status(400).json({ success: false, message : 'invalid email'})
        }
    }).catch(err => {
        res.status(400).json(err);
    })
})

router.get('/', (req, res) => {
    const { name, id } = req.query;
    const token = req.headers['x-access-token'];
    let query = `SELECT id, name, email, birthday, gender, introduce, point FROM accounts `;
    if (token)      query += `WHERE id=${jwt.decode(token, config.jwtSecret)}`
    else if (name && id) res.json(400).json({ success: false, message: 'too much query'});
    else if (name)  query += `WHERE name=${name}`;
    else if (id)    query += `WHERE id=${id}`;
    database.query(query)
    .then(rows => res.status(200).json({ success: true, profile: rows }))
    .catch(err => res.status(400).json({ success: false, message: err }));
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

//register
router.put('/',(req, res) => {
    const { name, email, password } = req.body;
    if(!(name && email && password))    res.status(400).json({ success: false, message: 'lack of input'})
    else {
        database.count('email',email).then(() => {
            return database.count('name',name);
        }).then(() => {
            return database.query(`INSERT INTO accounts(name, email, password) VALUES ('${name}', '${email}', '${password}')`)
        }).then(() => {
            res.status(201).json({ success: true });
        }).catch(err => {
            res.status(400).json({ success: false, message:err });
        })        
    }
});

module.exports = router;