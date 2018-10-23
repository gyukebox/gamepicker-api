const express = require('express');
const router = express.Router();
const jwt = require('jwt-simple');
const config = require('../config/jwt-config');
const database = require('../model/pool');

router.get('/', (req, res) => {
    const { search, limit, offset } = req.query;
    const { success, error } = require('../model/common')(res);
    let sql = `
    SELECT id, title, img_link
    FROM games `;
    if (search) 
        sql += `WHERE title LIKE '${search}' `
    if (limit) {
        sql += `LIMIT ${limit} `
        if (offset)
            sql += `OFFSET ${offset}`
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
    database.query(sql).then(count).then(success).catch(error);
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
        GROUP_CONCAT(DISTINCT(game_platforms.platform)) platforms,
        GROUP_CONCAT(DISTINCT(game_tags.tag)) tags
    FROM games
    LEFT JOIN game_platforms
    ON game_platforms.game_id = games.id
    LEFT JOIN game_tags
    ON game_tags.game_id = games.id `    
    const regNumber = /^[0-9]*$/;
    if (regNumber.test(id)) {
        sql += `WHERE games.id = '${id}' GROUP BY games.id`;
    } else {
        sql += `WHERE games.title = '${id}' GROUP BY games.id`;
    }
    const processing = (rows) => {
        const game = rows[0];
        game.tags = game.tags===null?[]:game.tags.split(',');
        game.platforms = game.platforms===null?[]:game.platforms.split(',');
        return game;
    }
    database.query(sql).then(processing).then(success).catch(error);
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
            VALUES ('${title}', '${developer}', '${publisher}', '${age_rate}', '${summary}', '${img_link}', '${video_link}')`
            database.query(sql)
            .then(rows => {
                const id = rows.insertId;
                
                const tagArr = [];
                tags.map(tag => tagArr.push(`('${id}','${tag}')`));
                if (tags.length !== 0)
                    database.query(`INSERT INTO game_tags(game_id, tag) VALUES ${tagArr.toString()}`)

                const platformArr = [];
                platforms.map(platform => platformArr.push(`('${id}','${platform}')`));
                if (platforms.length !== 0)
                    database.query(`INSERT INTO game_platforms(title, platform) VALUES ${platformArr.toString()}`)
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
            const { title, developer, publisher, age_rate, summary, img_link, video_link, tags, platforms } = req.body;
            let set_query = `SET `;
            if (title) set_query += `title='${title}',`
            if (developer) set_query +=`developer='${developer}',`
            if (publisher) set_query +=`publisher='${publisher}',`
            if (age_rate) set_query +=`age_rate='${age_rate}',`
            if (summary) set_query +=`summary='${summary}',`
            if (img_link) set_query +=`img_link='${img_link}',`
            if (video_link) set_query +=`video_link='${video_link}',`
            set_query = set_query.slice(0,-1);    
            database.query(`UPDATE games ${set_query} WHERE id = '${id}'`)
            .then(() => {
                return database.query(`DELETE FROM game_tags WHERE game_id=${id}`)
            }).then(() => {
                const tagArr = [];
                tags.map(tag => tagArr.push(`('${id}','${tag}')`));
                if (tags.length !== 0)
                    database.query(`INSERT INTO game_tags(game_id, tag) VALUES ${tagArr.toString()}`)
            }).then(() => {
                return database.query(`DELETE FROM game_platforms WHERE game_id=${id}`)
            }).then(() => {
                const platformArr = [];
                platforms.map(platform => platformArr.push(`('${id}','${platform}')`));
                if (platforms.length !== 0)
                    database.query(`INSERT INTO game_platforms(game_id, platform) VALUES ${platformArr.toString()}`)
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
            database.query(`DELETE FROM games WHERE id='${id}'`)
            .then(() => {
                return database.query(`DELETE FROM game_tags WHERE game_id=${id}`)
            }).then(() => {
                return database.query(`DELETE FROM game_platforms WHERE game_id=${id}`)
            }).then(resolve).catch(reject);
        })
    }
    authentication(req, null, null, true).then(query).then(success).catch(error);
})


router.get('/:id/comments', (req, res) => {
    const { success, error } = require('../model/common')(res);
    const { limit, offset } = req.query;
    const game_id = req.params.id;
    let sql = `
    SELECT 
        comments.id,
        comments.value,
        comments.update_date,
        users.name
    FROM game_comments AS comments
    JOIN accounts AS users
    ON comments.user_id = users.id
    WHERE comments.game_id = ${game_id}
    ORDER BY comments.update_date DESC `;
    if (limit) {
        sql += `LIMIT ${limit} `;
        if (offset)
            sql += `OFFSET ${offset}`;
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
    database.query(sql).then(count).then(success).catch(error);
})

router.post('/:id/comments', (req, res) => {
    const {  decodeToken, success, error } = require('../model/common')(res);
    const query = (user_id) => {
        const game_id = req.params.id;
        const { value } = req.body;
        const sql = `
        INSERT INTO game_comments(user_id, game_id, value) 
        VALUES('${user_id}', ${game_id}, '${value}')`
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
        UPDATE game_comments
        SET
            value = '${value}'
        WHERE game_id = '${id}' AND id = '${commentID}'`;
        return database.query(sql);
    }
    authentication(req, 'game_comments', commentID, false).then(query).then(success).catch(error);

})

router.delete('/:id/comments/:commentID', (req, res) => {
    const { id, commentID } = req.params;
    const { authentication, success, error } = require('../model/common')(res);
    const query = () => {
        const sql = `
        DELETE FROM game_comments
        WHERE game_id = '${id}' AND id = '${commentID}'`
        return database.query(sql);
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
        WHERE game_id='${game_id}' AND user_id='${user_id}'`;
        return database.query(sql);
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
            WHERE user_id='${user_id}' AND game_id='${game_id}'`
            database.query(sql)
            .then(rows => {
                if (rows[0].count > 0) {
                    const sql = `
                    UPDATE rates
                    SET value='${value}'
                    WHERE user_id='${user_id}' AND game_id='${game_id}'`
                    database.query(sql).then(resolve).catch(reject);
                } else {
                    const sql = `
                    INSERT INTO rates(user_id, game_id, value)
                    VALUES('${user_id}', '${game_id}', '${value}')`
                    database.query(sql).then(resolve).catch(reject);
                }
            })
        })
    }
    validate(req, payload).then(query).then(success).catch(error);
})

module.exports = router;