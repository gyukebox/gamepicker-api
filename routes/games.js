const express = require('express');
const router = express.Router();
const jwt = require('jwt-simple');
const config = require('../config/jwt-config');
const database = require('../model/pool');

router.get('/', (req, res) => {
    const { search, limit, offset } = req.query;
    const { success, error } = require('../model/common')(res);
    const option = [];
    let sql = `
    SELECT id, title, img_link
    FROM games `;
    if (search) {
        sql += `WHERE title LIKE ? `
        option.push('%'+search+'%');
    }
    if (limit) {
        sql += `LIMIT ? `
        option.push(Number(limit));
        if (offset) {
            sql += `OFFSET ?`
            option.push(Number(offset));
        }
    }
    const count = (rows) => {
        return new Promise((resolve, reject) => {
            const sql = `SELECT COUNT(*) AS count FROM games`;
            const json = {
                games: rows,
                count: 0
            }
            database.query(sql).then(rows => {                
                json.count = rows[0].count;
                resolve(json);
            }).catch(reject)
        })
    }
    database.query(sql,option).then(count).then(success).catch(error);
});

router.get('/:id', (req, res) => {
    const { id } = req.params;
    const { success, error } = require('../model/common')(res);
    let sql = `
    SELECT 
        games.id, 
        title, 
        developer,
        publisher, 
        age_rate, 
        summary, 
        img_link, 
        video_link, 
        games.update_date, 
        games.create_date,
        GROUP_CONCAT(DISTINCT(game_platforms.platform)) AS platforms,
        GROUP_CONCAT(DISTINCT(game_tags.tag)) AS tags
    FROM games
    LEFT JOIN game_platforms
    ON game_platforms.game_id = games.id
    LEFT JOIN game_tags
    ON game_tags.game_id = games.id `    
    const regNumber = /^[0-9]*$/;
    if (regNumber.test(id)) {
        sql += `WHERE games.id = ? GROUP BY games.id`;
    } else {
        sql += `WHERE games.title = ? GROUP BY games.id`;
    }
    const processing = (rows) => {
        const game = rows[0];
        game.tags = game.tags===null?[]:game.tags.split(',');
        game.platforms = game.platforms===null?[]:game.platforms.split(',');
        return game;
    }
    database.query(sql,[id]).then(processing).then(success).catch(error);
})

router.post('/' , (req, res) => {
    const { authentication ,validate, success, error } = require('../model/common')(res);
    const { title, developer, publisher, age_rate, summary, img_link, video_link, tags, platforms } = req.body;    
    const payload = {
        body: ['title', 'developer', 'publisher', 'age_rate', 'summary', 'img_link', 'video_link', 'tags', 'platforms']
    }
    const query = () => {
        return new Promise((resolve, reject) => {            
            const sql = `
            INSERT INTO games(title, developer, publisher, age_rate, summary, img_link, video_link)
            VALUES (?)`
            database.query(sql,[[title, developer, publisher, age_rate, summary, img_link, video_link]])
            .then(rows => {
                const id = rows.insertId;
                
                const tagArr = [];
                tags.map(tag => tagArr.push(`('${id}','${tag}')`));
                if (tags.length !== 0)
                    database.query(`INSERT INTO game_tags(game_id, tag) VALUES ?`, tagArr)
                const platformArr = [];
                platforms.map(platform => platformArr.push(`('${id}','${platform}')`));
                if (platforms.length !== 0)
                    database.query(`INSERT INTO game_platforms(title, platform) VALUES ?`,platformArr)
            }).then(resolve).catch(reject)
        })
    }
    const v = () => {
        return validate(req, payload);
    }
    authentication(req, null, null, true).then(v).then(query).then(success).catch(error);
})

router.put('/:id', (req, res) => {
    const { authentication, success, error } = require('../model/common')(res);
    const query = () => {
        return new Promise((resolve, reject) => {            
            const { id } = req.params;
            const { tags, platforms } = req.body;
            const names = ['title', 'developer', 'publisher', 'age_rate', 'summary', 'img_link', 'video_link'];
            const value = [];
            let set_query = `SET `;
            names.map(name => {
                if (req.body[name]) {
                    set_query += `${name}=?,`
                    option.push(req.body[name]);
                }
            })
            set_query = set_query.slice(0,-1);
            value.push(id);
            database.query(`UPDATE games ${set_query} WHERE id = ?`,value)
            .then(() => {
                return database.query(`DELETE FROM game_tags WHERE game_id=?`,[id])
            }).then(() => {
                const tagArr = [];
                tags.map(tag => tagArr.push(`('${id}','${tag}')`));
                if (tags.length !== 0)
                    database.query(`INSERT INTO game_tags(game_id, tag) VALUES ?`,tagArr)
            }).then(() => {
                return database.query(`DELETE FROM game_platforms WHERE game_id=?`,[id])
            }).then(() => {
                const platformArr = [];
                platforms.map(platform => platformArr.push(`('${id}','${platform}')`));
                if (platforms.length !== 0)
                    database.query(`INSERT INTO game_platforms(game_id, platform) VALUES ?`,platformArr)
            }).then(resolve).catch(reject);
        })

    }
    authentication(req, null, null, true).then(query).then(success).catch(error);
});

router.delete('/:id', (req, res) => {
    const { authentication, success, error } = require('../model/common')(res);
    const id = req.params.id;
    const query = () => {
        return new Promise((resolve, reject) => {
            database.query(`DELETE FROM games WHERE id=?`,[id])
            .then(() => {
                return database.query(`DELETE FROM game_tags WHERE game_id=?`,[id])
            }).then(() => {
                return database.query(`DELETE FROM game_platforms WHERE game_id=?`,[id])
            }).then(resolve).catch(reject);
        })
    }
    authentication(req, null, null, true).then(query).then(success).catch(error);
})


router.get('/:id/comments', (req, res) => {
    const { success, error } = require('../model/common')(res);
    const { limit, offset } = req.query;
    const game_id = req.params.id;
    const option = [game_id]
    let sql = `
    SELECT 
        comments.id,
        comments.value,
        comments.update_date,
        users.name
    FROM game_comments AS comments
    JOIN accounts AS users
    ON comments.user_id = users.id
    WHERE comments.game_id = ?
    ORDER BY comments.update_date DESC `;
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
            const json = {
                comments: rows
            }
            database.query(`SELECT COUNT(*) AS count FROM game_comments`)
            .then(rows => {
                json.count = rows[0].count;
                resolve(json);
            }).catch(reject);
        })
    }
    database.query(sql,option).then(count).then(success).catch(error);
})

router.post('/:id/comments', (req, res) => {
    const {  decodeToken, success, error } = require('../model/common')(res);
    const query = (user_id) => {
        const game_id = req.params.id;
        const { value } = req.body;
        const sql = `
        INSERT INTO game_comments(user_id, game_id, value) 
        VALUES (?,?,?)`
        return database.query(sql,[user_id,game_id,value]);
    }
    decodeToken(req,).then(query).then(success).catch(error);
})


router.put('/:id/comments/:commentID', (req, res) => {
    const { id, commentID } = req.params;
    const { authentication, success, error } = require('../model/common')(res);
    const { value } = req.body;
    const query = () => {
        if (!value)
            throw 'body.value is required'
        const sql = `
        UPDATE game_comments
        SET value = ?
        WHERE game_id = ? AND id = ?`;
        return database.query(sql,[value,id,commentID]);
    }
    authentication(req, 'game_comments', commentID, false).then(query).then(success).catch(error);

})

router.delete('/:id/comments/:commentID', (req, res) => {
    const { id, commentID } = req.params;
    const { authentication, success, error } = require('../model/common')(res);
    const query = () => {
        const sql = `
        DELETE FROM game_comments
        WHERE game_id = ? AND id = ?`
        return database.query(sql,[id,commentID]);
    }
    authentication(req, 'game_comments', commentID, true).then(query).then(success).catch(error);
})


router.get('/:gameID/rates/:userID', (req, res) => {
    const game_id = req.params.gameID;
    const user_id = req.params.userID;
    const { authentication, success, error } = require('../model/common')(res);
    const query = () => {
        const sql = `
        SELECT value 
        FROM rates 
        WHERE game_id=? AND user_id=?`;
        return database.query(sql,[game_id,user_id]);
    }
    authentication(req, 'users', user_id).then(query).then(success).then(error);
})

router.post('/:id/rates', (req, res) => {
    const { validate, success, error } = require('../model/common')(res);
    const token = req.headers['x-access-token'];
    const game_id = req.params.id;
    const { value } = req.body;
    const user_id = jwt.decode(token, config.jwtSecret).id;
    const payload = {
        headers: ['x-access-token'],
        body: ['value']
    }
    const query = () => {
        return new Promise((resolve, reject) => {
            const sql = `
            SELECT COUNT(*) AS count
            FROM rates
            WHERE user_id=? AND game_id=?`
            database.query(sql,[user_id,game_id])
            .then(rows => {
                if (rows[0].count > 0) {
                    const sql = `
                    UPDATE rates
                    SET value=?
                    WHERE user_id=? AND game_id=?`
                    database.query(sql,[value,user_id,game_id]).then(resolve).catch(reject);
                } else {
                    const sql = `
                    INSERT INTO rates(user_id, game_id, value)
                    VALUES(?, ?, ?)`
                    database.query(sql,[user_id,game_id,value]).then(resolve).catch(reject);
                }
            })
        })
    }
    validate(req, payload).then(query).then(success).catch(error);
})

router.get('/:id/rates', (req, res) => {
    const { id } = req.params;
    const { success, error } = require('../model/common')(res);
    database.query(`SELECT IFNULL(AVG(value), 0) AS value FROM rates WHERE game_id = ?`,[id]).then(success).catch(error);
})

module.exports = router;