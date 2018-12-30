const express = require('express');
const router = express.Router();
const db = require('../model/database');
const multer = require('multer');
const fs = require('fs');
const jwt = require('../model/jwt');

router.get('/:user_id', (req, res) => {
    const { user_id } = req.params;
    const { success, fail } = require('./common')(res);

    const getUser = () => new Promise((resolve, reject) => {
        db.query(`SELECT name, email, birthday, introduce, gender, points FROM users WHERE id = ?`,[user_id])
        .then(rows => {
            if (rows.length === 0) {
                reject({
                    code: 404,
                    data: {
                        message: 'User not found'
                    }
                })
            } else {
                const filename = jwt.encode({
                    user_id: user_id,
                    object: 'profile'
                })
                rows[0].profile = fs.existsSync(`uploads/${filename}.jpg`)?`api.gamepicker.co.kr/uploads/${filename}.jpg`:null;
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

router.put('/:user_id', (req, res) => {
    const token = req.headers['x-access-token'];
    const u_id = req.params.user_id;
    const { introduce } = req.body;
    const { decodeToken, success, fail } = require('./common')(res);

    const updateUser = (user_id) => new Promise((resolve, reject) => {
        if (user_id!= u_id) {
            reject({
                code: 401,
                data: {
                    message: 'Authentication failed'
                }
            })
        } else {
            db.query(`UPDATE users SET introduce = ? WHERE id = ?`,[introduce, user_id])
            .then(rows => {
                if (rows.affectedRows === 0) {
                    reject({
                        code: 404,
                        data: {
                            message: "User not found"
                        }
                    })
                } else {
                    resolve({
                        code: 204
                    })
                }
            }).catch(reject)
        }
    })

    decodeToken(token).then(updateUser).then(success).catch(fail);
})

router.post('/:user_id/profile', (req, res) => {
    const { user_id } = req.params;
    const { decodeToken, success, fail } = require('./common')(res);

    const createProfile = (u_id) => new Promise((resolve, reject) => {
        if (u_id != user_id) {
            reject({
                code: 401,
                message: "Authentication failed"
            })
        } else {
            const storage = multer.diskStorage({
                destination: (req, file, cb) => {
                    cb(null, `uploads/`)
                },
                filename: (req, file, cb) => {
                    const filename = jwt.encode({
                        user_id: user_id,
                        object: 'profile'
                    })
                    cb(null, filename + '.jpg');
                }
            });
    
            const up = multer({ storage: storage }).single('file');
            up(req, res, err => {
                if (err) {
                    reject({
                        code: 400,
                        data: {
                            message: err
                        }
                    })
                } else {
                    resolve({
                        code: 204
                    })
                }
            })
        }
    })
    decodeToken(token).then(createProfile).then(success).catch(fail);
})

router.delete('/:user_id/profile', (req, res) => {
    const { user_id } = req.params;
    const { decodeToken, success, fail } = require('./common')(res);
    const token = req.headers['x-access-token'];

    const deleteProfile = (u_id) => new Promise((resolve, reject) => {
        if (user_id === u_id) {
            const filename = jwt.encode({
                user_id: user_id,
                object: 'profile'
            })
            fs.unlinkSync(`./uploads/${filename}.jpg`);
            resolve({
                code: 204
            })
        } else {
            reject({
                code: 401,
                data: {
                    message: "Authentication failed"
                }
            })
        }
    })


    decodeToken(token).then(deleteProfile).then(success).catch(fail);
})

router.get('/:user_id/posts', (req, res) => {    
    const { user_id } = req.params;
    const { limit, offset } = req.query;
    const { success, fail } = require('./common')(res);
    const option = [user_id];
    let sql = `
    SELECT
        posts.id, posts.title, views, value, posts.updated_at,
        users.name, users.id as user_id,  
        games.title AS game_title, games.id AS game_id,
        (SELECT COUNT(1) FROM post_recommends WHERE post_id = posts.id) as recommends,
        (SELECT COUNT(1) FROM post_disrecommends WHERE post_id = posts.id) as disrecommends
    FROM
        posts
        LEFT JOIN users ON users.id = posts.user_id
        LEFT JOIN games ON games.id = posts.game_id
    WHERE posts.user_id = ?`;

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

router.get('/:user_id/reviews', (req, res) => {
    const { user_id } = req.params;
    const { limit, offset, game_id } = req.query;
    const { success, fail } = require('./common')(res);
    const option = [user_id];
    let sql = 'SELECT id, value, score FROM game_reviews WHERE user_id = ?';
    if (game_id) {
        sql += ` AND game_id = ?`
        option.push(game_id)
    }

    if (limit) {
        sql += ' LIMIT ?'
        option.push(Number(limit));
        if (offset) {
            sql += ' OFFSET ?';
            option.push(Number(offset));
        }
    }

    const getUserReviews = () => new Promise((resolve, reject) => {
        db.query(sql,option)
        .then(rows => {
            resolve({
                code: 200,
                data: {
                    reviews: rows
                }
            })
        }).catch(reject)
    })

    getUserReviews().then(success).catch(fail);
})

router.get('/:user_id/games/rating', (req, res) => {
    const { user_id } = req.params;
    const { success, fail } = require('./common')(res);

    const getUserRating = () => new Promise((resolve, reject) => {
        /*(SELECT JSON_ARRAYAGG(JSON_OBJECT("id",id,"value",value)) FROM game_tags LEFT JOIN tags ON tags.id = game_tags.tag_id WHERE game_tags.game_id = game_reviews.game_id) AS tag_id*/
        const sql = `
        SELECT 
            game_reviews.game_id, AVG(score) AS score, 
            (SELECT JSON_ARRAYAGG(value) FROM game_tags LEFT JOIN tags ON tags.id = game_tags.tag_id WHERE game_tags.game_id = game_reviews.game_id) AS tags,
            (SELECT JSON_ARRAYAGG(value) FROM game_platforms LEFT JOIN platforms ON platforms.id = game_platforms.platform_id WHERE game_platforms.game_id = game_reviews.game_id) AS platofrms 
        FROM game_reviews 
        WHERE game_reviews.user_id = ?
        GROUP BY game_reviews.game_id
        `
        db.query(sql,[user_id]).then(rows => {
            resolve({
                code: 200,
                data: {
                    data: rows
                }
            })
        }).catch(reject)
    })
    getUserRating().then(success).catch(fail);
})

router.get('/:user_id/games/recommend', (req, res) => {
    const { tags, limit } = req.query;
    const { success, fail } = require('./common')(res);
    const count = JSON.parse(tags).length;
    const tmp = '(' + tags.substring(1,tags.length-1) + ')'
    
    const recommendGames = () => new Promise((resolve ,reject) => {
        let sql = `
        SELECT id, title 
        FROM games 
        WHERE id IN (
            SELECT game_id 
            FROM (SELECT game_id, COUNT(game_id) AS count FROM game_tags WHERE tag_id IN ${tmp} GROUP BY game_id) AS tmp 
            WHERE count = ?
        )`;
        const option = [count];
        if (limit) {
            sql += ` LIMIT ?`;
            option.push(Number(limit));
        }
        db.query(sql, option)
        .then(rows => {
            resolve({
                code: 200,
                data: {
                    games: rows
                }
            })
        }).catch(reject);
    })
    recommendGames().then(success).catch(fail);
})

module.exports = router;