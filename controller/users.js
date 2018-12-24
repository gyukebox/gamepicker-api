const express = require('express');
const router = express.Router();
const db = require('../model/database');

router.get('/:user_id', (req, res) => {
    const { user_id } = req.params;
    const { success, fail } = require('./common')(res);

    const getUser = () => new Promise((resolve, reject) => {
        db.query(`SELECT name, email, birthday, gender, points FROM users WHERE id = ?`,[user_id])
        .then(rows => {
            if (rows.length === 0) {
                reject({
                    code: 404,
                    data: {
                        message: 'User not found'
                    }
                })
            } else {
                resolve({
                    code: 200,
                    data: {
                        user: rows[0]
                    }
                })
            }
        }).catch(reject)
    })

    getUser().then(success).catch(fail);
});

router.get('/:user_id/posts', (req, res) => {
    const { user_id } = req.params;
    const { limit, offset } = req.query;
    const { success, fail } = require('./common')(res);
    const option = [user_id];
    let sql = 'SELECT id, title FROM posts WHERE user_id = ?';

    if (limit) {
        sql += ' LIMIT ?'
        option.push(Number(limit));
        if (offset) {
            sql += ' OFFSET ?';
            option.push(Number(offset));
        }
    }

    const getUserPosts = () => new Promise((resolve, reject) => {
        db.query(sql,option)
        .then(rows => {
            resolve({
                code: 200,
                data: {
                    posts: rows
                }
            })
        }).catch(reject)
    })

    getUserPosts().then(success).catch(fail);
})

router.get('/:user_id/posts/comments', (req, res) => {
    const { user_id } = req.params;
    const { limit, offset } = req.query;
    const { success, fail } = require('./common')(res);
    const option = [user_id];
    let sql = 'SELECT id, value FROM post_comments WHERE user_id = ?';

    if (limit) {
        sql += ' LIMIT ?'
        option.push(Number(limit));
        if (offset) {
            sql += ' OFFSET ?';
            option.push(Number(offset));
        }
    }

    const getUserComments = () => new Promise((resolve, reject) => {
        db.query(sql,option)
        .then(rows => {
            resolve({
                code: 200,
                data: {
                    comments: rows
                }
            })
        }).catch(reject)
    })
    
    getUserComments().then(success).catch(fail);
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