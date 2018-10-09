const express = require('express');

const router = express.Router();
const jwt = require('jwt-simple');
const config = require('../config/jwt-config');

const Database = require('../model/Database');
const database = new Database();

const now = () => {
    return new Date().toLocaleString();;
}

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
    if (token)      query += `WHERE id=${jwt.decode(token, config.jwtSecret).id}`
    else if (name && id) res.json(400).json({ success: false, message: 'too much query'});
    else if (name)  query += `WHERE name='${name}'`;
    else if (id)    query += `WHERE id='${id}'`;
    database.query(query)
    .then(rows => res.status(200).json({ success: true, profile: rows }))
    .catch(err => res.status(400).json({ success: false, message: err }));
})

router.post('/', (req, res) => {
    const token = req.headers['x-access-token'];
    const { name, password, birthday, gender, introduce } = req.body;
    const id = jwt.decode(token, config.jwtSecret);
    const query = `UPDATE accounts SET (name, password, birthday, gender, introduce)
    = ('${name}', '${password}', '${birthday}', '${gender}', '${introduce}') WHERE id='${id}'`;
    database.unique('accounts', 'email', email)
    .then(() => {
        return database.unique('accounts', 'name', name)
    }).then(() => {
        return database.query(query)
    }).then(() => {
        res.status(200).json({success: true})
    }).catch(err => {
        res.status(400).json({success: false, message: err})
    })
});

//register
router.put('/',(req, res) => {
    const { name, email, password } = req.body;    
    if(!(name && email && password))    res.status(400).json({ success: false, message: 'lack of input'})
    else {
        database.unique('accounts', 'email', email).then(() => {
            return database.unique('accounts', 'name',name);
        }).then(() => {
            return database.query(`INSERT INTO accounts(name, email, password, login_date, create_date, update_date)
            VALUES ('${name}', '${email}', '${password}', '${now()}', '${now()}', '${now()}')`)
        }).then(() => {
            res.status(201).json({ success: true });
        }).catch(err => {
            res.status(400).json({ success: false, message:err });
        })        
    }
});

module.exports = router;