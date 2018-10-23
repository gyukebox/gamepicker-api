const express = require('express');
const router = express.Router();
const database = require('../model/pool');

router.get('/', (req, res) => {
    const { game, gameID, limit, offset } = req.query;
    const { success, error } = require('../model/common')(res);
    let sql = `
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
    if (game && game !== '자유') {
        sql += `WHERE game_id = (SELECT id FROM games WHERE title = '${game}')`
    }
    if (limit) {
        sql += `LIMIT ${limit} `
        if (offset)
            sql += `OFFSET ${offset}`
    }
    const count = (rows) => {
        return new Promise((resolve, reject) => {
            let sql = `SELECT COUNT(*) AS count FROM posts `;            
            if (gameID) {
                sql += `WHERE game_id = '${gameID}'`
            }
            if (game && game !== '자유') {
                sql += `WHERE game_id = (SELECT id FROM games WHERE title = '${game}')`
            }
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
    const { success, error } = require('../model/common')(res);
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
    const singulation = (rows) => {
        return rows[0];
    }
    database.query(sql).then(singulation).then(success).catch(error);
})

router.post('/', (req, res) => {
    const { decodeToken, success, error } = require('../model/common')(res);
    const { title, content, game_id } = req.body;
    const query = (user_id) => {
        if (!game_id)
            game_id = 0;
        const sql = `
        INSERT INTO posts(user_id, title, content, game_id)
        VALUES ( '${user_id}', '${title}', '${content}', '${game_id}')`;
        return database.query(sql);
    }
    decodeToken(req).then(query).then(success).catch(error);
})

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { authentication, success, error } = require('../model/common')(res);
    const { title, content, game_id } = req.body; 
    const query = () => {
        const sql = `
        UPDATE posts
        SET
            title = '${title}'
            content = '${content}'
            game_id = '${game_id}'
        WHERE id = '${id}'`
        return database.query(sql);
    }
    authentication(req, 'posts', id, true).then(query).then(success).catch(error);
})

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const { authentication, success, error } = require('../model/common')(res);
    const query = () => {
        const sql = `
        DELETE FROM posts
        WHERE id='${id}'`
        return database.query(sql);
    }
    authentication(req, 'posts', id, true).then(query).then(success).catch(error);
})

router.get('/:id/comments', (req, res) => {
    const { post_id } = req.params;
    const { success, error } = require('../model/common')(res);
    const { limit, offset } = req.query;
    let sql = `
    SELECT comment.id, user.name, comment.value, comment.update_date
    FROM post_comments AS comment
    LEFT JOIN accounts AS user
    ON comment.user_id = user.id
    WHERE comment.post_id = '${post_id}'
    ORDER BY comment.update_date DESC `
    if (limit) {
        sql += `LIMIT ${limit} `
        if (offset)
            sql += `OFFSET ${offset}`
    }
    database.query(sql).then(success).catch(error);
})

router.post('/:id/comments', (req, res) => {
    const { post_id } = req.params;        
    const { decodeToken, success, error } = require('../model/common')(res);
    const query = (user_id) => {        
        const { value } = req.body;
        if (!value) throw 'body.value is required'
        const sql = `
        INSERT INTO post_comments(user_id, post_id, value)
        VALUES('${user_id}','${post_id}','${value}')`
        return database.query(sql);
    }
    decodeToken(req).then(query).then(success).catch(error);
})

router.put('/:id/comments/:commentID', (req, res) => {
    const { id, commentID } = req.params;
    const { authentication, success, error } = require('../model/common')(res);
    const { value } = req.body;
    const query = () => {
        if (!value)
            throw 'body.value is required'
        const sql = `
        UPDATE post_comments
        SET
            value = '${value}'
        WHERE post_id = '${id}' AND id = '${commentID}'`;
        return database.query(sql);
    }
    authentication(req, 'post_comments', commentID, false).then(query).then(success).catch(error);
})

router.delete('/:id/comments/:commentID', (req, res) => {
    const { id, commentID } = req.params;
    const { authentication, success, error } = require('../model/common')(res);
    const query = () => {
        const sql = `
        DELETE FROM post_comments
        WHERE post_id = '${id}' AND id = '${commentID}'`
        return database.query(sql);
    }
    authentication(req, 'post_comments', commentID, true).then(query).then(success).catch(error);
})

module.exports = router;