const express = require('express');

const router = express.Router();
const jwt = require('jwt-simple');
const config = require('../config/jwt-config');

const database = require('../model/pool');

const now = () => {
    return new Date().toLocaleString();;
}

router.get('/test', (req, res) => {
    
})

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
                res.status(400).json({error : 'password is invalid'})
            }
        } else {
            res.status(400).json({error : 'email is invalid'})
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
    else if (name && id) res.json(400).json({error: 'too much query'});
    else if (name)  query += `WHERE name='${name}'`;
    else if (id)    query += `WHERE id='${id}'`;
    database.query(query)
    .then(rows => res.status(200).json({profile: rows }))
    .catch(err => res.status(400).json({error: err }));
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
        res.status(200);
    }).catch(err => {
        res.status(400).json({error: err})
    })
});

//register
router.put('/',(req, res) => {
    const { name, email, password } = req.body;    
    if(!(name && email && password))    res.status(400).json({error: 'lack of input'})
    else {
        database.unique('accounts', 'email', email).then(() => {
            return database.unique('accounts', 'name',name);
        }).then(() => {
            return database.query(`INSERT INTO accounts(name, email, password, login_date, create_date, update_date)
            VALUES ('${name}', '${email}', '${password}', '${now()}', '${now()}', '${now()}')`)
        }).then(() => {
            res.status(201);
        }).catch(err => {
            res.status(400).json({error: err});
        })        
    }
});

module.exports = router;