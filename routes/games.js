const express = require('express');
const router = express.Router();
const cert = require('../controller/certification')();

router.get('/', async (req, res, next) => {
    const { limit, offset, platform_id } = req.query;
    const { sort } = req.query;

    let sql = `
        SELECT
            id,
            title,
            developer,
            publisher,
            created_at,
            (SELECT JSON_ARRAYAGG(link) FROM game_images WHERE game_id = games.id) AS images,
            (SELECT JSON_ARRAYAGG(link) FROM game_videos WHERE game_id = games.id) AS videos,
            (SELECT JSON_ARRAYAGG(value) FROM game_tags LEFT JOIN tags ON tags.id = game_tags.tag_id WHERE game_id = games.id) AS tags,
            (SELECT JSON_ARRAYAGG(value) FROM game_platforms LEFT JOIN platforms ON platforms.id = game_platforms.platform_id WHERE game_id = games.id) AS platforms,
            (SELECT AVG(score) FROM game_score WHERE game_id = games.id) AS score,
            (SELECT COUNT(score) FROM game_score WHERE game_id = games.id) AS score_count
        FROM games`
    const option = [];

    if (platform_id) {
        sql += ` WHERE EXISTS (SELECT 1 FROM game_platforms WHERE game_id = games.id AND platform_id = ?)`;
        option.push(platform_id);
    }
    
    if (req.headers['x-access-token'] && req.query.sort === "rated") {
        const user_id = await cert.user(req);
        sql += platform_id?` AND`:` WHERE`
        sql += ` NOT EXISTS (SELECT 1 FROM game_features WHERE game_id = games.id AND user_id = ?)`;
        option.push(user_id);
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
            created_at,
            summary,
            age_rate,
            (SELECT JSON_ARRAYAGG(link) FROM game_images WHERE game_id = games.id) AS images,
            (SELECT JSON_ARRAYAGG(link) FROM game_videos WHERE game_id = games.id) AS videos,
            (SELECT JSON_ARRAYAGG(value) FROM game_tags LEFT JOIN tags ON tags.id = game_tags.tag_id WHERE game_id = games.id) AS tags,
            (SELECT JSON_ARRAYAGG(value) FROM game_platforms LEFT JOIN platforms ON platforms.id = game_platforms.platform_id WHERE game_id = games.id) AS platforms,
            (SELECT AVG(score) FROM game_score WHERE game_id = games.id) AS score,
            (SELECT COUNT(score) FROM game_score WHERE game_id = games.id) AS score_count,
            JSON_OBJECT(
                '게임성', AVG(게임성),
                '조작성', AVG(조작성),
                '난이도', AVG(난이도),
                '스토리', AVG(스토리),
                '몰입도', AVG(몰입도),
                'BGM', AVG(BGM),
                '공포성', AVG(공포성),
                '과금유도', AVG(과금유도),
                '노가다성', AVG(노가다성),
                '진입장벽', AVG(진입장벽),
                '필요성능', AVG(필요성능),
                '플레이타임', AVG(플레이타임),
                '가격', AVG(가격),
                'DLC', AVG(DLC),
                '버그', AVG(버그),
                '그래픽', AVG(그래픽)
            ) AS features
        FROM games LEFT JOIN game_features ON games.id = game_features.game_id
        WHERE games.id = ?`
    const option = [game_id];
    try {
        const [[game]] = await pool.query(sql, option);
        if (req.headers['x-access-token']) {
            const user_id = await cert.user(req);
            const [[favor]] = await pool.query(`SELECT 1 FROM favor WHERE user_id = ?`, [user_id]);
            const [[row]] = await pool.query(`SELECT score FROM game_score WHERE user_id = ?`, [user_id]);
            game.favor = !!favor;
            game.my_score = row?row.score:null;
        }
        if (!game)
            throw { status: 404, message: 'Game not found' }
        res.status(200).json({ game })
    } catch (err) {
        next(err);
    }
})

router.post('/', async (req, res, next) => {
    const { title, developer, publisher, summary, age_rate } = req.body;
    let { images, videos, tags, platforms } = req.body;
    
    images = JSON.parse(images);
    videos = JSON.parse(videos);
    tags = JSON.parse(tags);
    platforms = JSON.parse(platforms);

    try {
        await cert.admin(req);
        const [{insertId}] = await pool.query(`INSERT INTO games (title, developer, publisher, summary, age_rate) VALUES (?, ?, ?, ?, ?)`,[title, developer, publisher, summary, age_rate]);
        await pool.query(`INSERT INTO game_images (game_id, link) VALUES ${images.map(image => `(${insertId}, ?)`).toString()}`, images);
        await pool.query(`INSERT INTO game_videos (game_id, link) VALUES ${videos.map(video => `(${insertId}, ?)`).toString()}`, videos);
        await pool.query(`INSERT INTO game_tags (game_id, tag_id) VALUES ${tags.map(tag => `(${insertId}, ?)`).toString()}`, tags);
        await pool.query(`INSERT INTO game_platforms (game_id, platform_id) VALUES ${platforms.map(platform => `(${insertId}, ?)`).toString()}`, platforms);
        res.status(204).json();
    } catch (err) {
        next(err);
    }
});

router.get('/:game_id/features', async (req, res, next) => {
    const { game_id } = req.params;
    try {
        const user_id = await cert.user(req);
        const [[feature]] = await pool.query(`SELECT 게임성, 조작성, 난이도, 스토리, 몰입도, BGM, 공포성, 과금유도, 노가다성, 진입장벽, 필요성능, 플레이타임, 가격, DLC, 버그, 그래픽 FROM game_features WHERE game_id = ? AND user_id = ?`, [game_id, user_id]);
        res.status(200).json({ feature });
    } catch (err) {
        next(err);
    }
})

router.post('/:game_id/features', async (req, res, next) => {
    const { game_id } = req.params;
    const { 게임성, 조작성, 난이도, 스토리, 몰입도, BGM, 공포성, 과금유도, 노가다성, 진입장벽, 필요성능, 플레이타임, 가격, DLC, 버그, 그래픽 } = req.body;
    try {
        const user_id = await cert.user(req);
        const [rows] = await pool.query(`SELECT 1 FROM game_features WHERE game_id = ? AND user_id = ?`, [game_id, user_id]);
        if (rows.length !== 0) {
            await pool.query(`DELETE FROM game_features WHERE game_id = ? AND user_id = ?`, [game_id, user_id]);
        }
        await pool.query(`INSERT INTO game_features (game_id, user_id, 게임성, 조작성, 난이도, 스토리, 몰입도, BGM, 공포성, 과금유도, 노가다성, 진입장벽, 필요성능, 플레이타임, 가격, DLC, 버그, 그래픽)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [game_id, user_id, 게임성, 조작성, 난이도, 스토리, 몰입도, BGM, 공포성, 과금유도, 노가다성, 진입장벽, 필요성능, 플레이타임, 가격, DLC, 버그, 그래픽]);
        res.status(204).json();
    } catch (err) {
        if (err.errno === 1452)
            err = { status: 400, message: 'Game not found' }
        next(err);
    }
});

router.delete('/:game_id/features', async (req, res, next) => {
    const { game_id } = req.params;
    try {
        const user_id = await cert.user(req);
        await pool.query(`DELETE FROM game_features WHERE game_id = ? AND user_id = ?`, [game_id, user_id]);
        res.status(204).json();
    } catch (err) {
        next(err);
    }
})

router.put('/:game_id', async (req, res, next) => {
    const { game_id } = req.params;
    const { title, developer, publisher, summary, age_rate } = req.body;
    let { images, videos, platforms } = req.body;
    
    try {
        await cert.admin(req);
        await pool.query(`START TRANSACTION`);

        await pool.query(`UPDATE games SET title = ?, developer = ?, publisher = ?, summary = ?, age_rate = ? WHERE id = ?`,[title, developer, publisher, summary, age_rate, game_id]);
        await pool.query(`DELETE FROM game_images WHERE game_id = ?`,[game_id]);
        await pool.query(`DELETE FROM game_videos WHERE game_id = ?`,[game_id]);
        await pool.query(`DELETE FROM game_platforms WHERE game_id = ?`,[game_id]);

        await pool.query(`INSERT INTO game_images (game_id, link) VALUES ${images.map(image => `(${game_id}, ?)`).toString()}`, images);
        await pool.query(`INSERT INTO game_videos (game_id, link) VALUES ${videos.map(video => `(${game_id}, ?)`).toString()}`, videos);
        await pool.query(`INSERT INTO game_platforms (game_id, platform_id) VALUES ${platforms.map(platform => `(${game_id}, ?)`).toString()}`, platforms);

        await pool.query(`COMMIT`);
        res.status(204).json();
    } catch (err) {
        await pool.query(`ROLLBACK`)
        next(err);
    }
})

router.delete('/:game_id', async (req, res, next) => {
    const { game_id } = req.params;
    try {
        await cert.admin(req);
        const [rows] = await pool.query(`DELETE FROM games WHERE id = ?`, [game_id])
        if (rows.affectedRows === 0)
            throw { status: 410, message: "이미 삭제된 게임입니다" }
        res.status(204).json();
    } catch (err) {
        next(err);
    }
})

router.post('/:game_id/favor', async (req, res, next) => {
    const { game_id } = req.params;
    //toggle 이 가능하면 그쪽으로 변경
    try {
        const user_id = await cert.user(req);
        const [rows] = await pool.query(`INSERT INTO favor (user_id, game_id) SELECT ?, ? FROM dual  WHERE NOT EXISTS ( SELECT * FROM favor WHERE user_id = ? AND game_id = ? )`, [user_id, game_id, user_id, game_id]);
        if (rows.affectedRows === 0)
            throw { status:400, message: 'Already favorite this game' }
        res.status(204).json();
    } catch (err) {
        next(err);
    }
})

router.get('/:game_id/favor', async (req, res, next) => {
    const { game_id } = req.params;
    try {
        const user_id = await cert.user(req);
        const [rows] = await pool.query(`SELECT COUNT(1) as cnt FROM favor WHERE user_id = ? AND game_id = ?`,[user_id, game_id]);
        res.status(200).json({
            favor: rows[0].cnt?true:false
        })
    } catch (err) {
        next(err);
    }
})

router.delete('/:game_id/favor', async (req, res, next) => {
    const { game_id } = req.params;
    try {
        const user_id = await cert.user(req);
        const [rows] = await pool.query(`DELETE FROM favor WHERE user_id = ? AND game_id = ?`,[user_id, game_id]);
        if (rows.affectedRows === 0)
            throw { status: 410, message: 'You are not favorite this game'}
        res.status(204).json();
    } catch (err) {
        next(err);
    }
})

//admin 으로 이동?
router.post('/:game_id/advertising', async (req, res, next) => {
    const { game_id } = req.params;
    try {
        await cert.admin(req);
        await pool.query(`INSERT INTO advertising_games (game_id) VALUES (?)`, [game_id]);
        res.status(204).json();
    } catch (err) {
        next(err);
    }
});

router.post('/:game_id/affiliate', async (req, res, next) => {
    const { game_id } = req.params;
    try {
        await cert.admin(req);
        await pool.query(`INSERT INTO affiliate_games (game_id) VALUES (?)`, [game_id]);
        res.status(204).json();
    } catch (err) {
        next(err);
    }
});

router.get('/:game_id/score', async (req, res, next) => {
    const { game_id } = req.params;
    try {
        const user_id = await cert.user(req);
        const [[result]] = await pool.query(`SELECT score FROM game_score WHERE user_id = ? AND game_id = ?`, [user_id, game_id]);        
        const score = result?result.score:null
        res.status(200).json({ score });
    } catch (err) {
        next(err);
    }
})

router.put('/:game_id/score', async (req, res, next) => {
    const { game_id } = req.params;
    const { score } = req.body;
    try {
        const user_id = await cert.user(req);
        const [rows] = await pool.query(`SELECT 1 FROM game_score WHERE user_id = ? AND game_id = ?`, [user_id, game_id]);
        if (rows.length > 0) {
            await pool.query(`UPDATE game_score SET score = ? WHERE user_id = ? AND game_id = ?`, [score, user_id, game_id]);
        } else {
            await pool.query(`INSERT INTO game_score (user_id, game_id, score) VALUES (?, ?, ?)`, [user_id, game_id, score]);
        }
        res.status(204).json();
    } catch (err) {
        if (err.errno === 1452)
            err = { status: 400, message: 'Game not found' }
        next(err);
    }
});

router.put('/:game_id/comments', async (req, res, next) => {
    const { game_id } = req.params;
    const { comment } = req.body;
    try {
        const user_id = await cert.user(req);
        const [rows] = await pool.query(`SELECT 1 FROM game_comments WHERE user_id = ? AND game_id = ?`, [user_id, game_id]);
        if (rows.length > 0) {
            await pool.query(`UPDATE game_comments SET comment = ? WHERE user_id = ? AND game_id = ?`, [comment, user_id, game_id]);
        } else {
            await pool.query(`INSERT INTO game_comments (user_id, game_id, comment) VALUES (?, ?, ?)`, [user_id, game_id, comment]);
        } 
        res.status(204).json();
    } catch (err) {
        next(err);
    }
});

router.get(`/:game_id/comments`, async (req, res, next) => {
    const { game_id } = req.params;
    try {
        const [comments] = await pool.query(`SELECT comment, user_id, name AS user_name FROM game_comments LEFT JOIN users ON users.id = game_comments.user_id WHERE game_id = ?`, [game_id]);
        res.status(200).json({comments});
    } catch (err) {
        next(err);
    }
});

router.post('/:game_id/comments/:comment_id/recommends', async (req, res, next) => {
    const { game_id, comment_id } = req.params;
    try {
        const user_id = await cert.user(req);
        await pool.query(`INSERT INTO game_comment_recommends (user_id, comment_id) VALUES (?, ?)`, [user_id, comment_id]);
        res.status(204).json();
    } catch (err) {
        next(err);
    }
});

router.delete('/:game_id/comments/:comment_id/recommends', async (req, res, next) => {
    const { game_id, comment_id } = req.params;
    try {
        const user_id = await cert.user(req);
        await pool.query(`DELETE FROM game_comment_recommends WHERE user_id = ? AND comment_id = ?`, [user_id, comment_id]);
        res.status(204).json();
    } catch (err) {
        next(err);
    }
});

router.post('/:game_id/comments/:comment_id/disrecommends', async (req, res, next) => {
    const { game_id, comment_id } = req.params;
    try {
        const user_id = await cert.user(req);
        await pool.query(`INSERT INTO game_comment_disrecommends (user_id, comment_id) VALUES (?, ?)`, [user_id, comment_id]);
        res.status(204).json();
    } catch (err) {
        next(err);
    }
});

router.delete('/:game_id/comments/:comment_id/disrecommends', async (req, res, next) => {
    const { game_id, comment_id } = req.params;
    try {
        const user_id = await cert.user(req);
        await pool.query(`DELETE FROM game_comment_disrecommends WHERE user_id = ? AND comment_id = ?`, [user_id, comment_id]);
        res.status(204).json();
    } catch (err) {
        next(err);
    }
});

module.exports = router;