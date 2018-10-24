const express = require('express');
const router = express.Router();
const database = require('../model/pool');
const config = require('../config/jwt-config');
const jwt = require('jwt-simple');

router.get('/', (req, res) => {
    const { success, error } = require('../model/common')(res);
    const { limit, offset } = req.query;
    let sql = `
    SELECT id, name, birthday, gender, introduce, point, login_date, update_date, create_date
    FROM accounts `;
    if (limit) {
        sql += `LIMIT ${limit} `;
        if (offset)
            sql += `OFFSET ${offset}`;
    }
    const count = (rows) => {
        return new Promise((resolve, reject) => {
            const sql = `SELECT COUNT(*) AS count FROM accounts`;
            const json = {
                users : rows
            }
            database.query(sql).then(rows => {
                json.count = rows[0].count;
                resolve(json);
            }).catch(reject)
        })
    }
    database.query(sql).then(count).then(success).catch(error);
})

router.get('/:id', (req, res) => {
    const { error } = require('../model/common')(res);
    const { id } = req.params;
    const sql = `
    SELECT name, birthday, gender, introduce, point, login_date, update_date, create_date
    FROM accounts
    WHERE id = ${id}`
    const success = (rows) => {
        res.status(200).json({
            status: 'success',
            data: rows[0]
        })
    }
    database.query(sql).then(success).catch(error);
})

router.post('/', (req, res) => {
    const { success, error } = require('../model/common')(res);
    const { name, email, password } = req.body;
    console.log('aa');
    
    console.log(req.body);
    
    const sql = `
    INSERT INTO accounts(name, email, password)
    VALUES ('${name}', '${email}', '${password}')`
    const generateToken = (rows) => {
        const id = rows.insertId;
        const payload = { id: id };
        const token = jwt.encode(payload, config.jwtSecret);
        return { token: token }
    }
    database.query(sql).then(generateToken).then(success).catch(error);
})

//FIXME: 미완
router.put('/:id', (req, res) => {
    const { authentication, success, error } = require('../model/common')(res);
    const id = req.params.id;
    const query = () => {
        const sql = ``;
        return database.query(sql)
    }
    authentication(req, 'users', id, false).then(query).then(success).catch(error);
});

router.delete('/:id', (req, res) => {
    const { authentication, success, error } = require('../model/common')(res);
    const id = req.params.id;
    const query = () => {
        const sql = `
        DELETE FROM accounts
        WHERE id = ${id}`;
        return database.query(sql)
    }
    authentication(req, 'users', id, true).then(query).then(success).catch(error);
})

module.exports = router;