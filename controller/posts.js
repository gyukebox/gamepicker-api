const express = require('express');
const router = express.Router();
const db = require('../model/database');

router.get('/', (req, res) => {
    const { limit, offset } = req.query;
    const { success, fail } = require('./common')(res);

    const getAllPosts = () => new Promise((resolve, reject) => {
        const sql = `
        SELECT posts.id, title, name, views, value, posts.updated_at, COUNT(post_disrecommends.post_id) AS disrecommends, COUNT(post_recommends.post_id) AS recommends
        FROM posts 
            LEFT JOIN users on users.id = posts.user_id
            LEFT JOIN post_recommends ON post_recommends.post_id = posts.id
            LEFT JOIN post_disrecommends ON post_disrecommends.post_id = posts.id
        GROUP BY posts.id
        ORDER BY updated_at DESC`
        const option = [];
        if (limit) {
            sql += ' LIMIT ?';
            option.push(Number(limit));
            if (offset) {
                sql += ' OFFSET ?';
                option.push(Number(offset));
            }
        }
        db.query(sql, option)
        .then(rows => {
            resolve({
                code: 200,
                data: {
                    posts: rows
                }
            })
        }).catch(reject)
    })

    getAllPosts()
    .then(success)
    .catch(fail);
})

router.get('/:post_id', (req, res) => {
    const { post_id } = req.params;
    const { success, fail } = require('./common')(res);

    const getPost = () => new Promise((resolve, reject) => {
        const sql = `
        SELECT posts.id, title, name, views, value, posts.updated_at, COUNT(post_disrecommends.post_id) AS disrecommends, COUNT(post_recommends.post_id) AS recommends
        FROM posts 
            LEFT JOIN users on users.id = posts.user_id
            LEFT JOIN post_recommends ON post_recommends.post_id = posts.id
            LEFT JOIN post_disrecommends ON post_disrecommends.post_id = posts.id
        WHERE posts.id = ?`
        db.query(sql,[post_id])
        .then(rows => {
            if (rows.length === 0) {
                resolve({
                    code: 404,
                    data: {
                        message: 'Post not found'
                    }
                })
            } else {
                resolve({
                    code: 200,
                    data: {
                        post : rows[0]
                    }
                })
            }
        }).catch(reject)
    })

    getPost().then(success).catch(fail);
})

router.post('/', (req, res) => {
    const token = req.headers['x-access-token'];
    const { decodeToken, success, fail } = require('./common')(res);
    const { title, value } = req.body;

    const createPost = (user_id) => new Promise((resolve, reject) => {        
        db.query(`INSERT INTO posts (user_id, title, value) VALUES (?, ?, ?)`,[user_id, title, value])
        .then(rows => {
            resolve({
                code: 204
            })
        }).catch(reject)
    })

    decodeToken(token)
    .then(createPost)
    .then(success)
    .catch(fail)
})

router.put('/:post_id', (req, res) => {
    const { post_id } = req.params;
    const token = req.headers['x-access-token'];
    const { decodeToken, success, fail } = require('./common')(res);

    const updatePost = (user_id) => new Promise((resolve, reject) => {
        let SET_string = "";
        const option = [];
        ['title', 'value'].forEach(key => {
            const value = req.body[key];
            if (value) {
                SET_string += `${key} = ?,`
                option.push(value);
            }
        })
        SET_string = SET_string.substring(0,SET_string.length-1);
        option.push(post_id, user_id);

        if (SET_string === "") {
            reject({
                code: 400,
                data: {
                    message: "Either title or value is required"
                }
            })
        } else {
            db.query(`UPDATE posts SET ${SET_string} WHERE id = ? AND user_id = ?`,option)
            .then(rows => {
                resolve({
                    code: 204
                })
            }).catch(reject)
        }
    })

    decodeToken(token)
    .then(updatePost)
    .then(success)
    .catch(fail)
})

router.delete('/:post_id', (req, res) => {
    const { post_id } = req.params;
    const token = req.headers['x-access-token'];
    const { decodeToken, success, fail } = require('./common')(res);

    const deletePost = (user_id) => new Promise((resolve, reject) =>{
        db.query(`DELETE FROM posts WHERE user_id = ? AND id = ?`,[user_id, post_id])
        .then(rows => {
            if (rows.affectedRows === 0) {
                reject({
                    code: 404,
                    data: {
                        message: 'Post not found'
                    }
                })
            } else {
                resolve({
                    code: 204
                })
            }
        }).catch(reject)
    })

    decodeToken(token)
    .then(deletePost)
    .then(success)
    .catch(fail);
})

router.post('/:post_id/recommend', (req, res) => {
    const { post_id } = req.params;
    const token = req.headers['x-access-token'];
    const { decodeToken, success, fail } = require('./common')(res);

    const recommendPost = (user_id) => new Promise((resolve, reject) => {
        db.query(`INSERT INTO post_recommends (user_id, post_id) VALUES (?, ?)`,[user_id, post_id])
        .then(rows => {
            if (rows.affectedRows === 0) {
                reject({
                    code: 404,
                    data: {
                        message: 'Post not found'
                    }
                })
            } else {
                resolve({
                    code: 204
                })
            }
        }).catch(reject)
    })

    decodeToken(token)
    .then(recommendPost)
    .then(success)
    .catch(fail)
})

router.post('/:post_id/disrecommend', (req, res) => {
    const { post_id } = req.params;
    const token = req.headers['x-access-token'];
    const { decodeToken, success, fail } = require('./common')(res);

    const recommendPost = (user_id) => new Promise((resolve, reject) => {
        db.query(`INSERT INTO post_disrecommends (user_id, post_id) VALUES (?, ?)`,[user_id, post_id])
        .then(rows => {
            if (rows.affectedRows === 0) {
                reject({
                    code: 404,
                    data: {
                        message: 'Post not found'
                    }
                })
            } else {
                resolve({
                    code: 204
                })
            }
        }).catch(reject)
    })

    decodeToken(token)
    .then(recommendPost)
    .then(success)
    .catch(fail)
})

router.get('/:post_id/comments', (req, res) => {
    const { post_id } = req.params;
    const { success, fail } = require('./common')(res);
    const { limit, offset } = req.query;
    
    const readComments = () => new Promise((resolve, reject) => {
        let sql = `
        SELECT 
            p.id, p.value, p.updated_at, p.user_id,
            (SELECT name FROM users WHERE id = p.user_id) AS name, 
            (SELECT COUNT(*) FROM post_comment_recommends WHERE comment_id = p.id) AS recommends,
            (SELECT COUNT(*) FROM post_comment_disrecommends WHERE comment_id = p.id) AS disrecommends, 
            GROUP_CONCAT(
                JSON_OBJECT(
                    "id",c.id, 
                    "value",c.value, 
                    "user_id",c.user_id,
                    "updated_at",c.updated_at,
                    "name",(SELECT name FROM users WHERE id = c.user_id),
                    "recommends", (SELECT COUNT(*) FROM post_comment_recommends WHERE comment_id = c.id),
                    "disrecommends", (SELECT COUNT(*) FROM post_comment_disrecommends WHERE comment_id = c.id)
                )
            ) AS comments
        FROM 
            post_comments AS p
            LEFT JOIN
            post_comments AS c
            ON p.id = c.parent_id
        WHERE p.parent_id IS NULL AND p.post_id = ?
        GROUP BY p.id`
        const option = [post_id];
        if (limit) {
            sql += ' LIMIT ?';
            option.push(Number(limit));
            if (offset) {
                sql += ` OFFSET ?`;
                option.push(Number(offset));
            }
        }
        db.query(sql, option)
        .then(rows => {            
            rows.map(row => {
                row.comments = JSON.parse('['+row.comments+']')
                if (row.comments[0].id === null)
                    row.comments = [];
            })
            resolve({
                code: 200,
                data: {
                    comments: rows
                }
            })
        }).catch(reject)
    })

    readComments().then(success).catch(fail);
})


router.post('/:post_id/comments', (req, res) => {
    const { post_id } = req.params;
    const token = req.headers['x-access-token'];
    const { value, parent_id } = req.body;
    const { decodeToken, success, fail } = require('./common')(res);

    const createComment = (user_id) => new Promise((resolve, reject) => {
        db.query(`INSERT INTO post_comments (user_id, post_id, value, parent_id) VALUES (?, ?, ?, ?)`,[user_id, post_id, value, parent_id])
        .then(rows => {
            resolve({
                code: 201
            })
        }).catch(reject)
    })

    decodeToken(token)
    .then(createComment)
    .then(success)
    .catch(fail);
})

router.put('/:post_id/comments/:comment_id', (req, res) => {
    const { post_id, comment_id } = req.params;
    const token = req.headers['x-access-token'];
    const { value } = req.body;
    const { decodeToken, success, fail } = require('./common')(res);

    const updateComment = (user_id) => new Promise((resolve, reject) => {
        db.query(`UPDATE post_comments SET value = ? WHERE post_id = ? AND id = ? AND user_id = ?`,[value, post_id, comment_id, user_id])
        .then(rows => {
            if (rows.affectedRows === 0) {
                resolve({
                    code: 404,
                    data: {
                        message: 'Comment not found'
                    }
                })
            } else {
                resolve({
                    code: 204
                })
            }
        }).catch(reject)
    })

    decodeToken(token)
    .then(updateComment)
    .then(success)
    .catch(fail);
})

router.delete('/:post_id/comments/:comment_id', (req, res) => {
    const { post_id, comment_id } = req.params;
    const token = req.headers['x-access-token'];
    const { decodeToken, success, fail } = require('./common')(res);

    const deleteComment = (user_id) => new Promise((resolve, reject) => {
        db.query(`DELETE FROM post_comments WHERE user_id = ? AND post_id = ? AND id = ?`,[user_id, post_id, comment_id])
        .then(rows => {
            if (rows.affectedRows === 0) {
                resolve({
                    code: 404,
                    data: {
                        message: 'Comment not found'
                    }
                })
            } else {
                resolve({
                    code: 204
                })
            }
        }).catch(reject)
    })

    decodeToken(token)
    .then(deleteComment)
    .then(success)
    .catch(fail)
})

module.exports = router;