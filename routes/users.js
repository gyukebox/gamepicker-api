const express = require('express');
const router = express.Router();
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
            user_id: Number(user_id),
            object: 'profile'
        });
        user.profile = fs.existsSync(`uploads/${filename}.jpg`)?`api.gamepicker.co.kr/uploads/${filename}.jpg`:null;
        res.status(200).json({ user });  
    } catch (err) {
        next(err);
    }
});

router.get('/:user_id/posts', async (req, res, next) => {    
    const { user_id } = req.params;
    const { limit, offset } = req.query;
    const option = [user_id];
    let sql = `
    SELECT
        posts.id, posts.title, views, posts.created_at,
        users.name AS user_name, users.id as user_id,
        post_category.value AS category,
        games.title AS game_title, games.id AS game_id,
        (SELECT COUNT(1) FROM post_recommends WHERE post_id = posts.id) as recommends,
        (SELECT COUNT(1) FROM post_disrecommends WHERE post_id = posts.id) as disrecommends,
        (SELECT COUNT(1) FROM post_comments WHERE post_id = posts.id) as comment_count
    FROM
        posts
        LEFT JOIN users ON users.id = posts.user_id
        LEFT JOIN games ON games.id = posts.game_id
        LEFT JOIN post_category ON post_category.id = posts.category_id
    WHERE posts.user_id = ?
    ORDER BY posts.created_at DESC`;

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

router.get('/:user_id/games/follow', async (req, res, next) => {
    const { user_id } = req.params;
    try {
        const [games] = await pool.query(`SELECT title, id,
        (SELECT JSON_ARRAYAGG(link) FROM game_images WHERE game_images.game_id = favor.game_id) AS images
        FROM favor 
            LEFT JOIN games ON games.id = favor.game_id 
        WHERE user_id = ?`,[user_id]);
        res.status(200).json({ games });
    } catch (err) {
        next(err);
    }
});

router.get('/:user_id/games/score', async (req, res, next) => {
    const { user_id } = req.params;
    try {
        const [scores] = await pool.query(`SELECT score, title, id AS game_id, link AS game_image FROM game_score LEFT JOIN games ON games.id = game_score.game_id LEFT JOIN game_images ON game_images.game_id = games.id WHERE user_id = ?`, [user_id]);
        res.status(200).json({ scores });
    } catch (err) {
        next(err);
    }
});

router.get('/:user_id/games/comments', async (req, res, next) => {
    const { user_id } = req.params;
    try {
        const [comments] = await pool.query(`SELECT id, value, game_id, FROM game_comments WHERE user_id = ?`, [user_id]);
        res.status(200).json({ comments });
    } catch (err) {
        next(err);
    }
});

router.get('/:user_id/posts/comments/recommends', async (req, res, next) => {
    const { user_id } = req.params;
    try {
        const [comments] = await pool.query(`SELECT comment_id AS id FROM post_comment_recommends WHERE user_id = ?`, [user_id]);
        res.status(200).json({ comments }); 
    } catch (err) {
        next(err);
    }
});

router.get('/:user_id/posts/comments/disrecommends', async (req, res, next) => {
    const { user_id } = req.params;
    try {
        const [comments] = await pool.query(`SELECT comment_id AS id FROM post_comment_disrecommends WHERE user_id = ?`, [user_id]);
        res.status(200).json({ comments }); 
    } catch (err) {
        next(err);
    }
});

router.get('/:user_id/games/comments/recommends', async (req, res, next) => {
    const { user_id } = req.params;
    try {
        const [comments] = await pool.query(`SELECT comment_id AS id FROM game_comment_recommends WHERE user_id = ?`, [user_id]);
        res.status(200).json({ comments });
    } catch (err) {
        next(err);
    }
});

router.get('/:user_id/games/comments/disrecommends', async (req, res, next) => {
    const { user_id } = req.params;
    try {
        const [comments] = await pool.query(`SELECT comment_id AS id FROM game_comment_disrecommends WHERE user_id = ?`, [user_id]);
        res.status(200).json({ comments });
    } catch (err) {
        next(err);
    }
});

module.exports = router;