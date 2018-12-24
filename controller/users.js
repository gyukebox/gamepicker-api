const express = require('express');
const router = express.Router();
const db = require('../model/database');

router.get('/:name', (req, res) => {
    const { name } = req.params;
    db.query(`SELECT name, email, birthday, gender, points FROM users WHERE name = ?`,[name])
    .then(rows => {
        const obj = {
            success: true,
            data: rows[0]
        }
        let statusCode = 200;
        if (rows.length === 0) {
            obj.success = false;
            obj.data = 'user not found';
            statusCode = 404;
        }
        res.status(statusCode).json(obj);
    }).catch(err => {
        res.status(500).json({
            success: false,
            data: err
        })
    });
});

router.get('/:name/posts', (req, res) => {
    const { name } = req.params;
    const { limit, offset } = req.query;
    const option = [name];
    let sql = 'SELECT id, title FROM posts WHERE user_id = (SELECT id FROM users WHERE name = ?)';

    if (!isNaN(limit)) {
        sql += ' LIMIT ?'
        option.push(limit);
        if (!isNaN(offset)) {
            sql += ' OFFSET ?';
            option.push(offset);
        }
    }
    db.query(sql,option)
    .then(rows => {
        res.status(200).json({
            success: true,
            data: rows
        })
    }).catch(err => {
        res.status(500).json({
            success: false,
            data: err
        })
    })
})

router.get('/:name/posts/comments', (req, res) => {
    const { name } = req.params;
    const { limit, offset } = req.query;
    const option = [name];
    let sql = 'SELECT id, value FROM post_comments WHERE user_id = (SELECT id FROM users WHERE name = ?)';

    if (!isNaN(limit)) {
        sql += ' LIMIT ?'
        option.push(limit);
        if (!isNaN(offset)) {
            sql += ' OFFSET ?';
            option.push(offset);
        }
    }
    db.query(sql,option)
    .then(rows => {
        res.status(200).json({
            success: true,
            data: rows
        })
    }).catch(err => {
        res.status(500).json({
            success: false,
            data: err
        })
    })
})

router.get('/:name/games/comments', (req, res) => {
    const { name } = req.params;
    const { limit, offset } = req.query;
    const option = [name];
    let sql = 'SELECT id, title FROM game_comments WHERE user_id = (SELECT id FROM users WHERE name = ?)';

    if (!isNaN(limit)) {
        sql += ' LIMIT ?'
        option.push(limit);
        if (!isNaN(offset)) {
            sql += ' OFFSET ?';
            option.push(offset);
        }
    }
    db.query(sql,option)
    .then(rows => {
        res.status(200).json({
            success: true,
            data: rows
        })
    }).catch(err => {
        res.status(500).json({
            success: false,
            data: err
        })
    })
})

module.exports = router;