const express = require('express');
const router = express.Router();
const jwt = require('jwt-simple');
const config = require('../config/jwt-config');
const database = require('../model/pool');

router.get('/', (req, res) => {
    const { search, limit, offset, sort } = req.query;
    const { success, error } = require('../model/common')(res);
    const option = [];
    let sql = `
    SELECT games.id, title, img_link,
        GROUP_CONCAT(DISTINCT(game_platforms.platform)) AS platforms,
        (SELECT COUNT(*) FROM rates WHERE game_id = games.id) AS rate_count,
        IFNULL((SELECT AVG(value) FROM rates WHERE game_id = games.id), 0) AS rate
    FROM games
    LEFT JOIN game_platforms
    ON game_platforms.game_id = games.id
    GROUP BY games.id `;
    // FIXME: sort 옵션 
    switch (sort) {
        case 'rate':
            sql += `ORDER BY IFNULL((SELECT AVG(value) FROM rates WHERE game_id = games.id), 0) `;
            break;
        case 'popular':
            sql += `ORDER BY (SELECT COUNT(*) FROM rates WHERE game_id = games.id) `; 
            break;
        case 'random':
            sql += `ORDER BY rand() `; 
            break;
        default:
            sql += `ORDER BY update_date DESC `
            break;
    }
    if (search) {
        sql += `WHERE title LIKE ? `
        option.push('%'+search+'%');
    }
    if (limit) {
        sql += `LIMIT ? `
        option.push(Number(limit));
        if (offset) {
            sql += `OFFSET ? `
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

router.get('/recommend', (req, res) => {
    /*
    게임 추천 알고리즘
    1. (평점 - 평점 평균)으로 게임들을 소팅 
        —> 상위 10개의 게임에서 중복되는 태그의 개수로 선호하는 태그를 소팅 
        —> 상위의 n개의 태그들을 포함하는 게임들을 소팅 (n을 1씩 줄여가며 게임들을 뽑는다)
    2. 찜한 게임들의 중복되는 태그의 개수로 소팅 
        -> 상위의 n개의 태그들을 포함하는 게임들을 소팅 (n을 1씩 줄여가며 게임들을 뽑는다)
    3. 같은 성별, 나이의 오차값이 적은 (0, +-1, +-2 순서) 순서대로 좋아하는 게임을 소팅, 동차 일경우 중복되는 태그가 많은 게임이 우선순위
    4. 
    */
    const { decodeToken, success, error } = require('../model/common')(res);
    const query = (user_id) => {
        const rates_games = [];
        const rates_sql = `
        SELECT id 
        FROM games 
        ORDER BY 
            (SELECT AVG(value) 
            FROM rates 
            WHERE game_id=games.id AND user_id=?)`
        const favor_games = [];
        const similar_games = [];

    }
    decodeToken(req).then(query).then(success).catch(error);

})

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
        GROUP_CONCAT(DISTINCT(game_tags.tag)) AS tags,
        (SELECT COUNT(*) FROM rates WHERE game_id = ${id}) AS rate_count,
        IFNULL((SELECT AVG(value) FROM rates WHERE game_id = ${id}), 0) AS rate
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
        game.age_rate = game.age_rate===null?[]:game.age_rate.split(',');        
        game.tags = game.tags===null?[]:game.tags.split(',');
        game.platforms = game.platforms===null?[]:game.platforms.split(',');
        game.platforms = game.platforms.map(p => p.trim())
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
            database.query(sql,[[title, developer, publisher, age_rate.toString(), summary, img_link, video_link]])
            .then(rows => {
                const id = rows.insertId;
                const tagArr = [];
                let sql = `INSERT INTO game_tags(game_id, tag) VALUES `
                tags.map(tag => {
                    sql += `(?),`
                    tagArr.push([id,tag])
                });
                sql = sql.slice(0,-1);                
                if (tags.length !== 0)
                    database.query(sql,tagArr)

                const platformArr = [];
                sql = `INSERT INTO game_platforms(game_id, platform) VALUES `
                platforms.map(platform => {
                    sql += `(?),`
                    platformArr.push([id,platform])
                });
                sql = sql.slice(0,-1);          
                if (platforms.length !== 0)
                    database.query(sql,platformArr)
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
                console.log(req.body[name], name);
                
                if (req.body[name] !== '') {
                    set_query += `${name}=?,`;
                    if (name === 'age_rate') {
                        value.push(req.body[name].toString());
                    } else {
                        value.push(req.body[name]);
                    }
                }
            })
            set_query = set_query.slice(0,-1);
            value.push(id);            
            database.query(`UPDATE games ${set_query} WHERE id = ?`,value)
            .then(() => {
                return database.query(`DELETE FROM game_tags WHERE game_id=?`,[id])
            }).then(() => {
                const tagArr = [];
                let sql = `INSERT INTO game_tags(game_id, tag) VALUES `
                tags.map(tag => {
                    sql += `(?),`
                    tagArr.push([id,tag])
                });
                sql = sql.slice(0,-1);                
                if (tags.length !== 0)
                    database.query(sql,tagArr)
            }).then(() => {
                return database.query(`DELETE FROM game_platforms WHERE game_id=?`,[id])
            }).then(() => {
                const platformArr = [];
                let sql = `INSERT INTO game_platforms(game_id, platform) VALUES `
                platforms.map(platform => {
                    sql += `(?),`
                    platformArr.push([id,platform])
                });
                sql = sql.slice(0,-1);          
                if (platforms.length !== 0)
                    database.query(sql,platformArr)
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
            database.query(`SELECT COUNT(*) AS count FROM game_comments WHERE game_id=?`,[game_id])
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
        return new Promise((resolve, reject) => {
            const sql = `
            DELETE FROM game_comments
            WHERE game_id = ? AND id = ?`;
            database.query(sql,[id,commentID])
            .then(rows => {
                if (rows.affectedRows === 0) {
                    resolve('deleted nothing')
                } else {
                    resolve('deleted')
                }
            }).catch(reject)
        })
    }
    authentication(req, 'game_comments', commentID, true).then(query).then(success).catch(error);
})

router.post('/:id/comments/:commentID/recommend', (req, res) => {
    const { id, commentID } = req.params;
    const { decodeToken, success, error } = require('../model/common')(res);
    const query = (id) => {
        return new Promise((resolve, reject) => {
            database.query(`SELECT COUNT(*) AS count FROM game_comment_recommend WHERE user_id=?`,[id])
            .then(rows => {
                if (rows[0].count === 0) {
                    resolve('already recommend')
                } else {
                    const sql = `
                    INSERT INTO game_comment_recommend(user_id, comment_id)
                    VALUES (?,?)`
                    database.query(sql,[id, commentID])
                    .then(() => resolve())
                    .catch(reject);
                }
            })
        })
    }
    decodeToken(req).then(query).then(success).catch(error);
})

router.post('/:id/comments/:commentID/disrecommend', (req, res) => {
    const { id, commentID } = req.params;
    const { decodeToken, success, error } = require('../model/common')(res);
    const query = (id) => {
        return new Promise((resolve, reject) => {
            database.query(`SELECT COUNT(*) AS count FROM game_comment_disrecommend WHERE user_id=?`,[id])
            .then(rows => {
                if (rows[0].count === 0) {
                    resolve('already recommend')
                } else {
                    const sql = `
                    INSERT INTO game_comment_disrecommend(user_id, comment_id)
                    VALUES (?,?)`
                    database.query(sql,[id, commentID])
                    .then(() => resolve())
                    .catch(reject);
                }
            }).catch(reject)
        })
    }
    decodeToken(req).then(query).then(success).catch(error);
})

router.get('/:id/comments/:commentID/recommend', (req, res) => {
    const { id, commentID } = req.params;
    const { decodeToken, success, error } = require('../model/common')(res);
    const query = (id) => {
        return new Promise((resolve, reject) => {
            const sql = `
            SELECT COUNT(*) AS count FROM game_comment_recommend WHERE user_id=? AND comment_id=?`
            database.query(sql,[id, commentID])
            .then(rows => {
                if (rows[0].count === 0) {
                    resolve(false)
                } else {
                    resolve(true)
                }
            }).catch(reject)
        })
    }
    decodeToken(req).then(query).then(success).catch(error);
})

router.get('/:id/comments/:commentID/disrecommend', (req, res) => {
    const { id, commentID } = req.params;
    const { decodeToken, success, error } = require('../model/common')(res);
    const query = (id) => {
        return new Promise((resolve, reject) => {
            const sql = `
            SELECT COUNT(*) AS count FROM game_comment_disrecommend WHERE user_id=? AND comment_id=?`
            database.query(sql,[id, commentID])
            .then(rows => {
                if (rows[0].count === 0) {
                    resolve(false)
                } else {
                    resolve(true)
                }
            }).catch(reject)
        })
    }
    decodeToken(req).then(query).then(success).catch(error);
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
    const processing = (rows) => {
        if (rows[0].value)
            return rows[0].value;
        else
            return 0;
    }
    authentication(req, 'users', user_id, false).then(query).then(processing).then(success).catch(error);
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