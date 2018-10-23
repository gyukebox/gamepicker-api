const express = require('express');
const router = express.Router();
const database = require('../../model/pool');
const jwt = require('jwt-simple');
const config = require('../../config/jwt-config');

router.get('/', (req, res) => {
    const { gameID, limit, offset } = req.query;
    const { success, error } = require('../../model/common')(res);
    const sql = `
    SELECT
        posts.id,
        posts.game_id,
        posts.title,
        accounts.name,
        posts.content,
        posts.views,
        posts.update_date AS date,
        IFNULL((SELECT title FROM games WHERE id = posts.game_id),"자유") category,
        (SELECT COUNT(*) FROM recommends WHERE post_id = posts.id) recommends,
        (SELECT COUNT(*) FROM post_comments WHERE post_id = posts.id) comment_count
    FROM posts
    LEFT JOIN accounts
    ON posts.user_id = accounts.id `;
    if (gameID) {
        sql += `WHERE game_id = '${gameID}'`
    }
    if (limit) {
        sql += `LIMIT ${limit} `
        if (offset)
            sql += `OFFSET ${offset}`
    }
    const count = (rows) => {
        return new Promise((resolve, reject) => {
            const sql = `SELECT COUNT(*) AS count FROM posts`;
            const json = {
                posts: rows,
                count: 0
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
    const { id } = req.params;
    const { success, error } = require('../../model/common')(res);
    const sql = `
    SELECT posts.id,
        posts.title, 
        users.name, 
        posts.content, 
        posts.views, 
        posts.update_date,
        (SELECT COUNT(*) FROM recommends WHERE post_id = posts.id) recommend
    FROM posts
    JOIN accounts AS users
    ON posts.user_id = users.id
    WHERE id='${id}'`
    database.query(sql).then(success).catch(error);
})

router.post('/', (req, res) => {
    const { decodeToken, success, error } = require('../../model/common')(res);
    const query = (user_id) => {
        const sql = `
        INSERT INTO posts(user_id, title, content, game_id)
        VALUES ( '${user_id}', '${title}', '${content}', '${game_id}')`;
        return database.query(sql);
    }
    decodeToken(req).then(query).then(success).catch(error);
})

router.put('/:id', (req, res) => {
    const { id } = req.params;
})

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const { decodeToken, success, error } = require('../../model/common')(res);
    const query = (user_id) => {
        return new Promise((resolve, reject) => {
            const sql = `
            DELETE FROM posts
            WHERE id='${id}' AND user_id='${user_id}'`
            database.query(sql).then(rows => {
                if (rows.affectedRows === 0)
                    reject('permission error');
                resolve();
            })
        })
    }
    decodeToken(req).then(query).then(success).catch(error);
})

router.post('/:id/comments', (req, res) => {
    const { id } = req.params;
    const user_id = decodeToken(req);
    const { decodeToken, validate, success, error } = require('../../model/common')(res);
    const payload = {
        body: ['value']
    }
    const query = () => {
        const { value } = req.body;
        const sql = `
        INSERT INTO post_comments(user_id, post_id, value)
        VALUES('${user_id}','${post_id}','${value}')`
        return database.query(sql);
    }
    validate(req, payload).then(query).then(success).catch(error);
})

router.put('/:id/comments/:commentID', (req, res) => {
    const { id } = req.params;
})

router.delete('/:id/comments/:commentID', (req, res) => {
    const { id } = req.params;
})

module.exports = router;