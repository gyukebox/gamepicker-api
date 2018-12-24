const express = require('express');
const router = express.Router();
const db = require('../model/database');

router.get('/', (req, res) => {
    const { limit, offset } = req.query;
    const { success, fail } = require('./common')(res);
    
    const getAllGames = () => new Promise((resolve, reject) => {
        let sql = `
        SELECT 
            games.id, 
            title, 
            developer, 
            publisher, 
            updated_at, 
            GROUP_CONCAT(DISTINCT game_images.link) AS images, 
            GROUP_CONCAT(DISTINCT game_videos.link) AS videos, 
            GROUP_CONCAT(DISTINCT game_tags.tag_id) AS tags, 
            GROUP_CONCAT(DISTINCT platforms.value) AS platforms,
            AVG(game_comments.rate) AS rate,
            COUNT(game_comments.rate) AS rate_count
        FROM 
            games
            LEFT JOIN game_images
            ON games.id = game_images.game_id
            LEFT JOIN game_videos
            ON games.id = game_videos.game_id
            LEFT JOIN game_tags
            ON games.id = game_tags.game_id
            LEFT JOIN game_platforms
            ON games.id = game_platforms.game_id
            LEFT JOIN platforms
            ON game_platforms.platform_id = platforms.id
            LEFT JOIN game_comments
            ON game_comments.game_id = games.id
        GROUP BY games.id
            `
        const option = [];
        if (limit) {
            sql += ` LIMIT ?`
            option.push(Number(limit))
            if (offset) {
                sql += ` OFFSET ?`
                option.push(Number(offset))
            }
        }
        db.query(sql,option)
        .then(rows => {
            rows.map(row => {
                row.images = row.images===null?[]:row.images.split(',');
                row.videos = row.videos===null?[]:row.videos.split(',');
                row.tags = row.tags===null?[]:row.tags.split(',');
                row.platforms = row.platforms===null?[]:row.platforms.split(',');
            })
            resolve({
                code: 200,
                data: {
                    games: rows
                }
            })
        }).catch(reject)
    })

    getAllGames().then(success).catch(fail);
});

router.get('/:id', (req, res) => {
    const { id } = req.params;
    const { success, fail } = require('./common')(res);
    
    const getGame = () => new Promise((resolve, reject) => {
        let sql = `
        SELECT 
            games.id, 
            title, 
            developer, 
            publisher, 
            summary,
            age_rate,
            updated_at, 
            GROUP_CONCAT(DISTINCT game_images.link) AS images, 
            GROUP_CONCAT(DISTINCT game_videos.link) AS videos, 
            GROUP_CONCAT(DISTINCT game_tags.tag_id) AS tags, 
            GROUP_CONCAT(DISTINCT platforms.value) AS platforms,
            AVG(game_comments.rate) AS rate,
            COUNT(game_comments.rate) AS rate_count
        FROM 
            games
            LEFT JOIN game_images
            ON games.id = game_images.game_id
            LEFT JOIN game_videos
            ON games.id = game_videos.game_id
            LEFT JOIN game_tags
            ON games.id = game_tags.game_id
            LEFT JOIN game_platforms
            ON games.id = game_platforms.game_id
            LEFT JOIN platforms
            ON game_platforms.platform_id = platforms.id
            LEFT JOIN game_comments
            ON game_comments.game_id = games.id
        WHERE games.id = ?
        GROUP BY games.id`
        const option = [id];
        db.query(sql,option)
        .then(rows => {
            rows.map(row => {
                row.images = row.images===null?[]:row.images.split(',');
                row.videos = row.videos===null?[]:row.videos.split(',');
                row.tags = row.tags===null?[]:row.tags.split(',');
                row.platforms = row.platforms===null?[]:row.platforms.split(',');
            })
            resolve({
                code: 200,
                data: {
                    game: rows[0]
                }
            })
        }).catch(reject)
    })

    getGame().then(success).catch(fail);
})

router.post('/', (req, res) => {
    const { id } = req.params;
    const token = req.headers['x-access-token'];
    const { title, developer, publisher, summary, age_rate } = req.body;
    const { adminAuth, decodeToken, success, fail } = require('./common')(res);

    const createGame = () => new Promise((resolve, reject) => {
        ['title', 'developer', 'publisher', 'summary', 'age_rate'].forEach(key => {
            if (req.body[key] === undefined) {
                reject({
                    code: 400,
                    data: {
                        message: `${key} is required`
                    }
                })
            }
        })

        ['images', 'videos', 'tags', 'platforms'].forEach(key => {
            if (req.body[key] === []) {
                reject({
                    code: 400,
                    data: {
                        message: `At least one ${key} is required`
                    }
                })
            }
        })
        //FIXME: transaction required
        db.query(`INSERT INTO games (title, developer, publisher, summary, age_rate) VALUES (?, ?, ?, ?, ?)`[title, developer, publisher, summary, age_rate])
        .then(rows => {

        }).catch(reject)
    })

    decodeToken(token).then(adminAuth).then(createGame).then(success).catch(fail);
})

router.put('/:id', (req, res) => {

})

router.delete('/:id', (req, res) => {
    const token = req.headers['x-access-token'];
    const { id } = req.params;
    const { decodeToken ,adminAuth, success, fail } = require('./common')(res);

    const deleteGame = () => new Promise((resolve, reject) => {
        db.query(`DELETE FROM games WHERE id = ?`,[id])
        .then(rows => {
            resolve({
                code: 204
            })
        }).catch(reject)
    })

    decodeToken(token).then(adminAuth).then(deleteGame).then(success).catch(fail);
})

//FIXME: detail
router.get('/:id/comments', (req, res) => {
    const { id } = req.params;
    const { success, fail } = require('./common')(res);
    
    const getComments = () => new Promise((resolve, reject) => {
        db.query(`SELECT id, value FROM game_comments WHERE game_id = ?`,[id])
        .then(rows => {
            resolve({
                code: 200,
                data: {
                    comments: rows
                }
            })
        }).catch(reject);
    })

    getComments().then(success).catch(fail);
})

router.post('/:game_id/comments', (req, res) => {
    const { game_id } = req.params;
    const token = req.headers['x-access-token'];
    const { decodeToken, success, fail } = require('./common')(res);
    const { value, parent_id } = req.body;

    const createComment = (user_id) => new Promise((resolve, reject) => {
        db.query(`INSERT INTO game_comments (parent_id, user_id, game_id, value) VALUES (?, ?, ?, ?)`,[parent_id, user_id, game_id, value])
        .then(rows => {
            resolve({
                code: 204
            })
        }).catch(reject);
    })

    decodeToken(token).then(createComment).then(success).catch(fail);
})

router.put('/:game_id/comments/:comment_id', (req, res) => {
    const { game_id, comment_id } = req.params;
    const token = req.headers['x-access-token'];
    const { decodeToken, success, fail } = require('./common')(res);
    const { value } = req.body;

    const updateComment = (user_id) => new Promise((resolve, reject) => {
        db.query(`UPDATE game_comments SET value = ? WHERE game_id = ? AND id = ? AND user_id = ?`,[value, game_id, comment_id, user_id])
        .then(rows => {
            if (rows.affectedRows === 0) {
                reject({
                    code: 404,
                    data: {
                        message: 'comment not found'
                    }
                })
            } else {
                resolve({
                    code: 204
                })
            }
        }).catch(reject);
    })

    decodeToken(token).then(updateComment).then(success).catch(fail);
})

router.delete('/:game_id/comments/:comment_id', (req, res) => {
    const { game_id, comment_id } = req.params;
    const token = req.headers['x-access-token'];
    const { decodeToken, success, fail } = require('./common')(res);

    const deleteComment = (user_id) => new Promise((resolve, reject) => {
        db.query(`DELETE FROM game_comments WHERE game_id = ? AND id = ? AND user_id = ?`,[game_id, comment_id, user_id])
        .then(rows => {
            if (rows.affectedRows === 0) {
                reject({
                    code: 404,
                    data: {
                        message: 'comment not found'
                    }
                })
            } else {
                resolve({
                    code: 204
                })
            }
        }).catch(reject);
    })

    decodeToken(token).then(deleteComment).then(success).catch(fail);
})

router.post('/:game_id/favor', (req, res) => {
    const token = req.headers['x-access-token'];
    const { decodeToken, success, fail } = require('./common')(res);
    const { game_id } = req.params;

    const enrollFavor = (user_id) => new Promise((resolve, reject) => {
        db.query(`INSERT INTO favor (user_id, game_id) 
        SELECT ?, ? FROM dual 
        WHERE NOT EXISTS (
            SELECT * FROM favor WHERE user_id = ? AND game_id = ?
        )`,[user_id, game_id, user_id, game_id])
        .then(rows => {
            if (rows.affectedRows === 0) {
                reject({
                    code: 400,
                    data: {
                        message: 'Already favorite this game'
                    }
                })
            } else {
                resolve({
                    code: 204
                })
            }
        }).catch(reject)
    })

    decodeToken(token).then(enrollFavor).then(success).catch(fail)
})

module.exports = router;