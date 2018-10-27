const express = require('express');
const router = express.Router();
const database = require('../model/pool');

router.get('/', (req, res) => {
    const { game, gameID, limit, offset } = req.query;
    const { success, error } = require('../model/common')(res);
    const option = [];
    let sql = `
    SELECT
        posts.id,
        posts.game_id,
        posts.title,
        accounts.name,
        posts.content,
        posts.views,
        posts.update_date,
        IFNULL((SELECT title FROM games WHERE id = posts.game_id),"자유") category,
        (SELECT COUNT(*) FROM recommends WHERE post_id = posts.id) recommends,
        (SELECT COUNT(*) FROM post_comments WHERE post_id = posts.id) comment_count
    FROM posts
    LEFT JOIN accounts
    ON posts.user_id = accounts.id `;
    if (gameID) {
        sql += `WHERE game_id = ?`
        option.push(gameID)
    }
    if (game && game !== '자유') {
        sql += `WHERE game_id = (SELECT id FROM games WHERE title = ?)`
        option.push(game)
    }
    sql += `ORDER BY update_date DESC `
    if (limit) {
        sql += `LIMIT ? `
        option.push(limit)
        if (offset) {
            sql += `OFFSET ?`
            option.push(offset)
        }
    }
    const count = (rows) => {
        return new Promise((resolve, reject) => {
            const option = [];
            let sql = `SELECT COUNT(*) AS count FROM posts `;            
            if (gameID) {
                sql += `WHERE game_id = ?`
                option.push(gameID)
            }
            if (game && game !== '자유') {
                sql += `WHERE game_id = (SELECT id FROM games WHERE title = ?)`
                option.push(game)
            }
            const json = {
                posts: rows,
                count: 0
            }
            database.query(sql,option).then(rows => {                
                json.count = rows[0].count;
                resolve(json);
            }).catch(reject)
        })
    }
    database.query(sql,option).then(count).then(success).catch(error);
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
        (SELECT COUNT(*) FROM recommends WHERE post_id = posts.id) recommend,
        (SELECT COUNT(*) FROM disrecommends WHERE post_id = posts.id) disrecommend
    FROM posts
    JOIN accounts AS users
    ON posts.user_id = users.id
    WHERE posts.id=?`
    const singulation = (rows) => {
        return rows[0];
    }
    database.query(sql,[id]).then(singulation).then(success).catch(error);
})

router.post('/', (req, res) => {
    const { decodeToken, success, error } = require('../model/common')(res);
    const { title, content, game_id } = req.body;
    const query = (user_id) => {
        if (!game_id)
            game_id = 0;
        const sql = `
        INSERT INTO posts(user_id, title, content, game_id)
        VALUES (?)`;
        return database.query(sql,[[user_id, title, content, game_id]]);
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
            title = ?,
            content = ?,
            game_id = ?
        WHERE id = ?`
        return database.query(sql,[title, content, game_id,id]);
    }
    authentication(req, 'posts', id, true).then(query).then(success).catch(error);
})

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const { authentication, success, error } = require('../model/common')(res);
    const query = () => {
        const sql = `
        DELETE FROM posts
        WHERE id=?`
        return database.query(sql,[id]);
    }
    authentication(req, 'posts', id, true).then(query).then(success).catch(error);
})

router.post('/:id/recommend', (req, res) => {
    const { id } = req.params;
    const { decodeToken, success, error } = require('../model/common')(res);
    const query = (user_id) => {
        return new Promise((resolve, reject) => {
            database.query(`SELECT COUNT(*) AS count FROM recommends WHERE post_id = ? AND user_id = ?`,[id, user_id])
            .then(rows => {
                if (rows[0].count === 0) {
                    database.query(`INSERT INTO recommends(post_id, user_id) VALUES (?)`,[[id, user_id]]).then(() => resolve('recommend')).catch(reject)
                } else {
                    database.query(`DELETE FROM recommends WHERE post_id = ? AND user_id = ?`,[id, user_id]).then(() => resolve('cancel')).catch(reject)
                }
            })
        })
    }
    decodeToken(req).then(query).then(success).catch(error);
})

router.post('/:id/disrecommend', (req, res) => {
    const { id } = req.params;
    const { decodeToken, success, error } = require('../model/common')(res);
    const query = (user_id) => {
        return new Promise((resolve, reject) => {
            database.query(`SELECT COUNT(*) AS count FROM disrecommends WHERE post_id = ? AND user_id = ?`,[id, user_id])
            .then(rows => {
                if (rows[0].count === 0) {
                    database.query(`INSERT INTO disrecommends (post_id, user_id) VALUES (?)`,[[id,user_id]]).then(() => resolve('disrecommend')).catch(reject)
                } else {
                    database.query(`DELETE FROM disrecommends WHERE post_id = ? AND user_id = ?`,[id, user_id]).then(() => resolve('cancel')).catch(reject)
                }
            }).catch(reject);
        })
    }
    decodeToken(req).then(query).then(success).catch(error);
})

router.get('/:id/recommend', (req, res) => {
    const { id } = req.params;
    const { decodeToken, success, error } = require('../model/common')(res);
    const query = (user_id) => {
        return new Promise((resolve, reject) => {
            database.query(`SELECT COUNT(*) AS count FROM recommends WHERE post_id = ? AND user_id = ?`,[id, user_id])
            .then(rows => {
                if (rows[0].count === 0) {
                   resolve(false);
                } else {
                    resolve(true);
                }
            }).catch(reject);
        })
    }
    decodeToken(req).then(query).then(success).catch(error);
})

router.get('/:id/disrecommend', (req, res) => {
    const { id } = req.params;
    const { decodeToken, success, error } = require('../model/common')(res);
    const query = (user_id) => {
        return new Promise((resolve, reject) => {
            database.query(`SELECT COUNT(*) AS count FROM disrecommends WHERE post_id = ? AND user_id = ?`,[id, user_id])
            .then(rows => {
                if (rows[0].count === 0) {
                   resolve(false);
                } else {
                    resolve(true);
                }
            }).catch(reject);
        })
    }
    decodeToken(req).then(query).then(success).catch(error);
})

router.get('/:id/comments', (req, res) => {
    const { success, error } = require('../model/common')(res);
    const { limit, offset } = req.query;
    const post_id = req.params.id;
    const option = [post_id];
    let sql = `
    SELECT 
        comments.id,
        comments.value,
        comments.update_date,
        users.name
    FROM post_comments AS comments
    JOIN accounts AS users
    ON comments.user_id = users.id
    WHERE comments.post_id = ?
    ORDER BY comments.update_date DESC `;
    if (limit) {
        sql += `LIMIT ? `;
        option.push(limit)
        if (offset) {
            sql += `OFFSET ?`;
            option.push(offset)
        }
    }
    const count = (rows) => {
        return new Promise((resolve, reject) => {
            const json = {
                comments: rows
            }
            database.query(`SELECT COUNT(*) AS count FROM post_comments WHERE post_id = ?`,[post_id])
            .then(rows => {
                json.count = rows[0].count;
                resolve(json);
            }).catch(reject);
        })
    }
    database.query(sql).then(count).then(success).catch(error);
})

router.post('/:id/comments', (req, res) => {
    const {  decodeToken, success, error } = require('../model/common')(res);
    const query = (user_id) => {
        const post_id = req.params.id;
        const { value } = req.body;
        const sql = `
        INSERT INTO post_comments(user_id, post_id, value) 
        VALUES(?)`
        return database.query(sql,[[user_id, post_id, value]]);
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
            value = ?
        WHERE post_id = ? AND id = ?`;
        return database.query(sql),[value, id, commentID];
    }
    authentication(req, 'post_comments', commentID, false).then(query).then(success).catch(error);
})

router.delete('/:id/comments/:commentID', (req, res) => {
    const { id, commentID } = req.params;
    const { authentication, success, error } = require('../model/common')(res);
    const query = () => {
        const sql = `
        DELETE FROM post_comments
        WHERE post_id = ? AND id = ?`
        return database.query(sql,[id, commentID]);
    }
    authentication(req, 'post_comments', commentID, true).then(query).then(success).catch(error);
})

module.exports = router;