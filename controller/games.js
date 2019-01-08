const express = require('express');
const router = express.Router();
const jwt = require('../model/jwt');

router.get('/', async (req, res, next) => {
    const { limit, offset, platform_id } = req.query;
    const { sort } = req.query;

    let sql = `
        SELECT
            id,
            title,
            developer,
            publisher,
            updated_at,
            (SELECT JSON_ARRAYAGG(link) FROM game_images WHERE game_id = games.id) AS images,
            (SELECT JSON_ARRAYAGG(link) FROM game_videos WHERE game_id = games.id) AS videos,
            (SELECT JSON_ARRAYAGG(value) FROM game_tags LEFT JOIN tags ON tags.id = game_tags.tag_id WHERE game_id = games.id) AS tags,
            (SELECT JSON_ARRAYAGG(value) FROM game_platforms LEFT JOIN platforms ON platforms.id = game_platforms.platform_id WHERE game_id = games.id) AS platforms,
            (SELECT AVG(score) FROM game_reviews WHERE game_id = games.id) AS score,
            (SELECT COUNT(score) FROM game_reviews WHERE game_id = games.id) AS score_count
        FROM games`
    const option = [];

    if (platform_id) {
        sql += ` WHERE EXISTS (SELECT 1 FROM game_platforms WHERE game_id = games.id AND platform_id = ?)`;
        option.push(platform_id);
    }

    switch (sort) {
        case "random":
            sql += ` ORDER BY RAND()`
            break;
    
        default:
            break;
    }
    if (limit) {
        sql += ` LIMIT ?`
        option.push(Number(limit))
        if (offset) {
            sql += ` OFFSET ?`
            option.push(Number(offset))
        }
    }
    try {
        const [games] = await pool.query(sql, option);
        res.status(200).json({ games })
    } catch (err) {
        next(err);
    }
});

router.get('/:game_id', async (req, res, next) => {
    const { game_id } = req.params;
    let sql = `
        SELECT
            id,
            title,
            developer,
            publisher,
            updated_at,
            summary,
            age_rate,
            (SELECT JSON_ARRAYAGG(link) FROM game_images WHERE game_id = games.id) AS images,
            (SELECT JSON_ARRAYAGG(link) FROM game_videos WHERE game_id = games.id) AS videos,
            (SELECT JSON_ARRAYAGG(value) FROM game_tags LEFT JOIN tags ON tags.id = game_tags.tag_id WHERE game_id = games.id) AS tags,
            (SELECT JSON_ARRAYAGG(value) FROM game_platforms LEFT JOIN platforms ON platforms.id = game_platforms.platform_id WHERE game_id = games.id) AS platforms,
            (SELECT AVG(score) FROM game_reviews WHERE game_id = games.id) AS score,
            (SELECT COUNT(score) FROM game_reviews WHERE game_id = games.id) AS score_count
        FROM games
        WHERE games.id = ?`
    const option = [game_id];
    try {
        const [[game]] = await pool.query(sql, option);
        if (!game)
            throw { status: 404, message: 'Game not found' }
        res.status(200).json({ game })
    } catch (err) {
        next(err);
    }
})

router.post('/', async (req, res, next) => {
    const token = req.headers['x-access-token'];
    const { title, developer, publisher, summary, age_rate } = req.body;
    let { images, videos, tags, platforms } = req.body;
    
    images = JSON.parse(images);
    videos = JSON.parse(videos);
    tags = JSON.parse(tags);
    platforms = JSON.parse(platforms);

    try {
        const { email, password } = jwt.decode(token);
        const [rows] = await pool.query(`SELECT 1 FROM admin LEFT JOIN users ON users.id = admin.user_id WHERE email = ? AND password = ?`,[email, password]);
        if (rows.length === 0)
            throw { status: 401, message: 'Administrator authentication required' }
        const [{insertId}] = await pool.query(`INSERT INTO games (title, developer, publisher, summary, age_rate) VALUES (?, ?, ?, ?, ?)`,[title, developer, publisher, summary, age_rate]);
        await pool.query(`INSERT INTO game_images (game_id, link) VALUES ${images.map(image => `(${insertId}, ?)`).toString()}`, images);
        await pool.query(`INSERT INTO game_videos (game_id, link) VALUES ${videos.map(video => `(${insertId}, ?)`).toString()}`, videos);
        await pool.query(`INSERT INTO game_tags (game_id, tag_id) VALUES ${tags.map(tag => `(${insertId}, ?)`).toString()}`, tags);
        await pool.query(`INSERT INTO game_platforms (game_id, platform_id) VALUES ${platforms.map(platform => `(${insertId}, ?)`).toString()}`, platforms);
        res.status(204).json();
    } catch (err) {
        next(err);
    }
})

router.put('/:game_id', async (req, res, next) => {
    const { game_id } = req.params;
    const token = req.headers['x-access-token'];
    const { title, developer, publisher, summary, age_rate } = req.body;
    let { images, videos, tags, platforms } = req.body;
    
    images = JSON.parse(images);
    videos = JSON.parse(videos);
    tags = JSON.parse(tags);
    platforms = JSON.parse(platforms);
    try {
        const { email, password } = jwt.decode(token);
        const [rows] = await pool.query(`SELECT 1 FROM admin LEFT JOIN users ON users.id = admin.user_id WHERE email = ? AND password = ?`,[email, password]);
        if (rows.length === 0)
            throw 'Admin required'
        await pool.beginTransaction();
        await pool.query(`START TRANSACTION`)

        await pool.query(`UPDATE games SET title = ?, developer = ?, publisher = ?, summary = ?, age_rate = ?`,[title, developer, publisher, summary, age_rate]);
        await pool.query(`DELETE FROM game_images WHERE game_id = ?`,[game_id]);
        await pool.query(`DELETE FROM game_videos WHERE game_id = ?`,[game_id]);
        await pool.query(`DELETE FROM game_tags WHERE game_id = ?`,[game_id]);
        await pool.query(`DELETE FROM game_platforms WHERE game_id = ?`,[game_id]);

        await pool.query(`INSERT INTO game_images (game_id, link) VALUES ${images.map(image => `(${insertId}, ?)`).toString()}`, images);
        await pool.query(`INSERT INTO game_videos (game_id, link) VALUES ${videos.map(video => `(${insertId}, ?)`).toString()}`, videos);
        await pool.query(`INSERT INTO game_tags (game_id, tag_id) VALUES ${tags.map(tag => `(${insertId}, ?)`).toString()}`, tags);
        await pool.query(`INSERT INTO game_platforms (game_id, platform_id) VALUES ${platforms.map(platform => `(${insertId}, ?)`).toString()}`, platforms);

        await pool.query(`COMMIT`);
        res.status(204).json();
    } catch (err) {
        await pool.query(`ROLLBACK`)
        next(err);
    }
})

router.delete('/:game_id', async (req, res, next) => {
    const token = req.headers['x-access-token'];
    const { game_id } = req.params;
    try {
        const { email, password } = jwt.decode(token);
        const [[admin]] = await pool.query(`SELECT 1 FROM admin LEFT JOIN users ON users.id = admin.user_id WHERE email = ? AND password = ?`,[email, password]);
        if (!admin)
            throw { status: 401, message: '관리자 권한이 필요합니다' }
        const [rows] = await pool.query(`DELETE FROM games WHERE id = ?`, [game_id])
        if (rows.affectedRows === 0)
            throw { status: 410, message: "이미 삭제된 게임입니다" }
        res.status(204).json();
    } catch (err) {
        next(err);
    }
})

router.post('/:game_id/reviews', async (req, res, next) => {
    const { game_id } = req.params;
    const { value, score } = req.body;
    const token = req.headers['x-access-token'];

    let sql = `
    INSERT INTO game_reviews (game_id, user_id, value, score)
    SELECT ?, ?, ?, ? FROM DUAL
    WHERE NOT EXISTS (SELECT * FROM game_reviews WHERE user_id = ? AND game_id = ?)
    `
    try {
        const { email, password } = jwt.decode(token);
        const [[user]] = await pool.query(`SELECT id FROM users WHERE email = ? AND password = ?`, [email, password]);
        const [rows] = await pool.query(sql, [game_id, user.id, value, score, user.id, game_id]);
        if (rows.affectedRows === 0)
            throw { status: 400, message: "Already write review this game" }
        res.status(204).json();
    } catch (err) {
        next(err);
    }
})

router.get('/:game_id/reviews', async (req, res, next) => {
    const { game_id } = req.params;
    const { limit, offset } = req.query;
    
    let sql = `
        SELECT game_reviews.id, name, value, score
        FROM
            game_reviews
            LEFT JOIN users ON game_reviews.user_id = users.id
        WHERE game_id = ? AND value IS NOT NULL
        `
    const option = [game_id]
    if (limit) {
        sql += ` LIMIT ?`;
        option.push(Number(limit));
        if (offset) {
            sql += ` OFFSET ?`;
            option.push(Number(offset));
        }
    }
    try {
        const [reviews] = await pool.query(sql, option);
        res.status(200).json({ reviews })
    } catch (err) {
        next(err);
    }
})

router.put('/:game_id/reviews/:review_id', async (req, res, next) => {
    const { game_id, review_id } = req.params;
    const token = req.headers['x-access-token'];
    const option = [];
    let set_string = "";
    ["value", "score"].forEach(key => {
        const item = req.body[key];
        if (item) {
            set_string += `${key} = ?,`
            option.push(item)
        }
    })
    set_string = set_string.substring(0, set_string.length-1);
    try {
        const { email, password } = jwt.decode(token);
        const [[user]] = await pool.query(`SELECT id FROM users WHERE email = ? AND password = ?`,[email, password]);
        if (!user)
            throw { status: 404, message: 'User not found' }
        option.push(review_id, game_id, user.id);
        const [rows] = await pool.query(`UPDATE FROM game_reviews SET ${set_string} WHERE id = ? AND game_id = ? AND user_id = ?`, option);
        if (rows.affectedRows === 0)
            throw { status: 404, message: 'Review not found' }
        res.status(204).json();
    } catch (err) {
        next(err);
    }
})

router.delete('/:game_id/reviews/:review_id', async (req, res, next) => {
    const { game_id, review_id } = req.params;
    const token = req.headers['x-access-token'];
    try {
        const { email, password } = jwt.decode(token);
        const [[user]] = await pool.query(`SELECT id FROM users WHERE email = ? AND password = ?`, [email, password]);
        const [rows] = await pool.query(`DELETE FROM game_reviews WHERE user_id = ? AND game_id = ? AND id = ?`, [user.id, game_id, review_id]);
        if (rows.affectedRows === 0)
            throw { status: 404, message: 'Review not found' }
        res.status(204).json();
    } catch (err) {
        next(err);
    }
})

router.post('/:game_id/favor', async (req, res, next) => {
    const token = req.headers['x-access-token'];
    const { game_id } = req.params;
    try {
        const { email, password } = jwt.decode(token);
        const [[user]] = await pool.query(`SELECT id FROM users WHERE email = ? AND password = ?`,[email, password]);
        const [rows] = await pool.query(`INSERT INTO favor (user_id, game_id) SELECT ?, ? FROM dual  WHERE NOT EXISTS ( SELECT * FROM favor WHERE user_id = ? AND game_id = ? )`, [user.id, game_id, user.id, game_id]);
        if (rows.affectedRows === 0)
            throw { status:400, message: 'Already favorite this game' }
        res.status(204).json();
    } catch (err) {
        next(err);
    }
})

router.get('/:game_id/favor', async (req, res, next) => {
    const token = req.headers['x-access-token'];
    const { game_id } = req.params;
    try {
        const { email, password } = jwt.decode(token);
        const [[user]] = await pool.query(`SELECT id FROM users WHERE email = ? AND password = ?`, [email, password]);
        const [rows] = await pool.query(`SELECT COUNT(1) as cnt FROM favor WHERE user_id = ? AND game_id = ?`,[user.id, game_id]);
        res.status(200).json({
            favor: rows[0].cnt?true:false
        })
    } catch (err) {
        next(err);
    }
})

router.delete('/:game_id/favor', async (req, res, next) => {
    const token = req.headers['x-access-token'];
    const { game_id } = req.params;
    try {
        const { email, password } = jwt.decode(token);
        const [[user]] = await pool.query(`SELECT id FROM users WHERE email = ? AND password = ?`,[email, password]);
        const [rows] = await pool.query(`DELETE FROM favor WHERE user_id = ? AND game_id = ?`,[user.id, game_id]);
        if (rows.affectedRows === 0)
            throw { status: 410, message: 'You are not favorite this game'}
        res.status(204).json();
    } catch (err) {
        next(err);
    }
})

module.exports = router;