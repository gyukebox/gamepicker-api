const express = require('express');
const router = express.Router();
const database = require('../model/pool');
const config = require('../config/jwt-config');
const jwt = require('jwt-simple');

router.get('/', (req, res) => {
    const { success, error } = require('../model/common')(res);
    const { limit, offset } = req.query;
    const option = [];
    let sql = `
    SELECT id, name, birthday, gender, IFNULL(introduce, "") AS introduce, point, login_date, update_date, create_date
    FROM accounts `;
    if (limit) {
        sql += `LIMIT ? `;
        option.push(Number(limit))
        if (offset) {
            sql += `OFFSET ?`;
            option.push(Number(offset))
        }
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

router.get('/:id/posts', (req, res) => {
    const { id } = req.params;
    const { success, error } = require('../model/common')(res);
    const sql = `
    SELECT id, title
    FROM posts
    WHERE user_id = ?`
    database.query(sql, [id]).then(success).catch(error);
})

router.get('/:id/games', (req, res) => {
    const { id } = req.params;
    const { success, error } = require('../model/common')(res);
    const sql = `
    SELECT (SELECT id, title, img_link FROM games WHERE id = game_id)
    FROM favors
    WHERE user_id = ?`
    database.query(sql, [id]).then(success).catch(error);
})

router.get('/:id/posts/comments', (req, res) => {
    const { id } = req.params;
    const { success, error } = require('../model/common')(res);
    const sql = `
    SELECT id, value, post_id
    FROM post_comments
    WHERE user_id = ?`
    database.query(sql, [id]).then(success).catch(error);
})

router.get('/:id/games/comments', (req, res) => {
    const { id } = req.params;
    const { success, error } = require('../model/common')(res);
    const sql = `
    SELECT id, value, game_id
    FROM game_comments
    WHERE user_id = ?`
    database.query(sql, [id]).then(success).catch(error);
})

router.get('/:id/rates', (req, res) => {
    const { id } = req.params;
    const { success, error } = require('../model/common')(res);
    const sql = `
    SELECT (SELECT id, title, img_link FROM games WHERE id = rates.game_id)
    FROM rates
    WHRERE user_id = ?`
    database.query(sql, [id]).then(success).catch(error);
})

router.get('/:id', (req, res) => {
    const { error } = require('../model/common')(res);
    const { id } = req.params;
    const sql = `
    SELECT name, birthday, gender, IFNULL(introduce, "") AS introduce, point, login_date, update_date, create_date
    FROM accounts
    WHERE id = ?`
    const success = (rows) => {
        res.status(200).json({
            status: 'success',
            data: rows[0]
        })
    }
    database.query(sql,[id]).then(success).catch(error);
})

router.post('/', (req, res) => {
    const { success, error } = require('../model/common')(res);
    const { name, email, password } = req.body;
    const query = () => {
        return new Promise((resolve,reject) => {
            database.query(`SELECT EXISTS(SELECT * FROM accounts WHERE name = ?) AS name, EXISTS(SELECT * FROM accounts WHERE email = ?) AS email`,[name,email])
            .then(rows => {
                if (rows[0].name) {
                    reject('name is duplicate')
                } else if (rows[0].email) {
                    reject('email is duplicate')
                } else {
                    const sql = `
                    INSERT INTO accounts(name, email, password)
                    VALUES (?, ?, ?)`
                    database.query(sql,[name, email, password]).then(resolve).catch(reject);
                }
            }).catch(reject);
        })
    }
    const generateToken = (rows) => {
        const id = rows.insertId;
        const payload = { id: id };
        const token = jwt.encode(payload, config.jwtSecret);
        return { token: token }
    }
    query().then(generateToken).then(success).catch(error);
})

router.put('/:id', (req, res) => {
    const { authentication, success, error } = require('../model/common')(res);
    const { id } = req.params;
    const { name, birthday, gender, introduce } = req.body;  
    console.log(req.body);
      
    const query = () => {
        return new Promise((resolve, reject) => {            
            database.query(`SELECT EXISTS(SELECT id FROM accounts WHERE name = ?) AS exist`, [name])
            .then(rows => {
                if (rows[0].exist) {
                    reject(`${name} is exist`)
                } else {
                    const param = [];
                    let sql = `
                    UPDATE accounts
                    SET `;
                    
                    const tmp = [
                        {label: 'name', value: name},
                        {label: 'birthday', value: birthday},
                        {label: 'gender', value: gender},
                        {label: 'introduce', value: introduce}
                    ]
                    tmp.forEach(item => {
                        if (item.value) {
                            sql += `${label}=? `;
                            param.push(item.value);
                        }
                    })
                    sql += 'WHERE id=?'
                    param.push(id);
                    database.query(sql,param)
                    .then(resolve).catch(reject)
                }
            }).catch(reject);
        })
    }
    authentication(req, 'users', id, false).then(query).then(success).catch(error);
});

router.delete('/:id', (req, res) => {
    const { authentication, success, error } = require('../model/common')(res);
    const id = req.params.id;
    const query = () => {
        const sql = `
        DELETE FROM accounts
        WHERE id = ?`;
        return database.query(sql,[id])
    }
    authentication(req, 'users', id, true).then(query).then(success).catch(error);
})

module.exports = router;