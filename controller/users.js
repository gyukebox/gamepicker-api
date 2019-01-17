const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const jwt = require('../model/jwt');

router.get('/', async (req, res, next) => {
    const { name, email } = req.query;    
    try {
        let sql = `SELECT id, email, name FROM users`;
        const options = [];
        if (name || email)
            sql += ` WHERE`
        if (name) {
            sql += ` name = ?`;
            options.push(name);
        }
        if (email) {
            sql += ` email = ?`;
            options.push(email);
        }
        const [users] = await pool.query(sql, options);
        res.status(200).json({users});
    } catch (err) {
        next(err);
    }
    
});

router.get('/:user_id', async (req, res, next) => {
    const { user_id } = req.params;
    try {
        const [[user]] = await pool.query(`SELECT name, email, birthday, introduce, gender, points FROM users WHERE id = ?`,[user_id]);
        if (!user)
            throw { status: 404, message: 'User not found' }
        const filename = jwt.encode({
            user_id: user_id,
            object: 'profile'
        });
        user.profile = fs.existsSync(`uploads/${filename}.jpg`)?`api.gamepicker.co.kr/uploads/${filename}.jpg`:null;
        res.status(200).json({ user });  
    } catch (err) {
        next(err);
    }
});

router.put('/:user_id', async (req, res, next) => {
    const token = req.headers['x-access-token'];
    const { user_id } = req.params;
    const { introduce } = req.body;
    try {
        const { email, password } = jwt.decode(token);
        const [[user]] = await pool.query(`SELECT id FROM users WHERE email = ? AND password = ?`,[email, password]);
        if (!user)
            throw { status: 404, message: 'User not found' }
        if (user.id != user_id)
            throw { status: 401, message: 'Authentication failed' }
        await pool.query(`UPDATE users SET introduce = ? WHERE id = ?`,[introduce, user.id]);
        res.status(204).json();
    } catch (err) {
        next(err);
    }
})

router.post('/:user_id/profile', async (req, res, next) => {
    const { user_id } = req.params;
    const token = req.headers['x-access-token'];
    try {
        const { email, password } = jwt.decode(token);
        const [[user]] = await pool.query(`SELECT id FROM users WHERE email = ? AND password = ?`,[email, password]);
        if (user.id != user_id)
            throw { status: 401, message: "Authentication failed" }
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
            if (err)
                throw err;
            res.status(204).json();
        })
    } catch (err) {
        next(err);
    }
})

router.delete('/:user_id/profile', async (req, res, next) => {
    const { user_id } = req.params;
    const token = req.headers['x-access-token'];
    try {
        const { email, password } = jwt.decode(token);
        const [[user]] = await pool.query(`SELECT id FROM users WHERE email = ? AND password = ?`,[email, password]);
        if (user.id != user_id) 
            throw { status: 401, message: "Authentication failed" }
        const filename = jwt.encode({
            user_id: user_id,
            object: 'profile'
        })
        fs.unlinkSync(`./uploads/${filename}.jpg`);
        res.status(204).json();
    } catch (err) {
        next(err);
    }
})

router.get('/:user_id/posts', async (req, res, next) => {    
    const { user_id } = req.params;
    const { limit, offset } = req.query;
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

    try {
        const [posts] = await pool.query(sql, option);
        res.status(200).json({ posts });
    } catch (err) {
        next(err);
    }
})

router.get('/:user_id/posts/comments', async (req, res, next) => {
    const { user_id } = req.params;
    const { limit, offset } = req.query;
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

    try {
        const [comments] = await pool.query(sql, option);
        res.status(200).json({ comments });
    } catch (err) {
        next(err);
    }
})

router.get('/:user_id/reviews', async (req, res, next) => {
    const { user_id } = req.params;
    const { limit, offset, game_id } = req.query;
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

    try {
        const [reviews] = await pool.query(sql, option);
        res.status(200).json({ reviews });
    } catch (err) {
        next(err);
    }
})

router.get('/:user_id/games/rating', async (req, res, next) => {
    const { user_id } = req.params;
    const sql = `
        SELECT 
            game_reviews.game_id, AVG(score) AS score, 
            (SELECT JSON_ARRAYAGG(value) FROM game_tags LEFT JOIN tags ON tags.id = game_tags.tag_id WHERE game_tags.game_id = game_reviews.game_id) AS tags,
            (SELECT JSON_ARRAYAGG(value) FROM game_platforms LEFT JOIN platforms ON platforms.id = game_platforms.platform_id WHERE game_platforms.game_id = game_reviews.game_id) AS platforms 
        FROM game_reviews 
        WHERE game_reviews.user_id = ?
        GROUP BY game_reviews.game_id
        `
    
    try {
        const [data] = await pool.query(sql,[user_id]);
        res.status(200).json({ data });
    } catch (err) {
        next(err);
    }
})

router.get('/:user_id/games/recommend', async (req, res, next) => {
    const { tags, limit } = req.query;
    const count = JSON.parse(tags).length;
    const tmp = '(' + tags.substring(1,tags.length-1) + ')'

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
    try {
        const [games] = pool.query(sql, option);
        res.status(200).json({ games });
    } catch (err) {
        next(err);
    }
})

router.get('/:user_id/games/favor', async (req, res, next) => {
    const { user_id } = req.params;
    
    try {
        const [rows] = await pool.query(`SELECT game_id FROM favor WHERE user_id = ?`,[user_id]);
        const favor = rows.map(obj => obj.game_id);
        res.status(200).json({ favor });
    } catch (err) {
        next(err);
    }
})

module.exports = router;