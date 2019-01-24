const express = require('express');
const router = express.Router();
const jwt = require('../model/jwt');

router.get('/', async (req, res, next) => {
    const { limit, offset, game_id } = req.query;
    let sql = `
    SELECT
        posts.id, posts.title, views, value, posts.updated_at,
        users.name, users.id as user_id,  
        games.title AS game_title, games.id AS game_id,
        (SELECT COUNT(1) FROM post_recommends WHERE post_id = posts.id) as recommends,
        (SELECT COUNT(1) FROM post_disrecommends WHERE post_id = posts.id) as disrecommends,
        (SELECT COUNT(1) FROM post_comments WHERE post_id = posts.id) as comment_count
    FROM
        posts
        LEFT JOIN users ON users.id = posts.user_id
        LEFT JOIN games ON games.id = posts.game_id`
    const option = [];
    if (game_id) {
        sql += ` WHERE game_id = ?`
        option.push(Number(game_id));
    }
    sql += ` GROUP BY posts.id ORDER BY posts.updated_at DESC`
    if (limit) {
        sql += ' LIMIT ?';
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

router.get('/:post_id', async (req, res, next) => {
    const { post_id } = req.params;
    const sql = `
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
    WHERE posts.id = ?`

    try {
        const [[post]] = await pool.query(sql, [post_id]);
        if (!post)
            throw { status: 404, message: 'Post not found' }
        res.status(200).json({ post })
    } catch (err) {
        next(err);
    }
})

router.post('/', async (req, res, next) => {
    const token = req.headers['x-access-token'];
    const { title, value, game_id } = req.body;

    try {
        const { email, password } = jwt.decode(token);
        const [[user]] = await pool.query(`SELECT id FROM users WHERE email = ? AND password = ?`, [email, password]);
        await pool.query(`INSERT INTO posts (user_id, title, value, game_id) VALUES (?, ?, ?, ?)`,[user.id, title, value, game_id]);
        res.status(204).json();
    } catch (err) {
        next(err);
    }
})

router.put('/:post_id', async (req, res, next) => {
    const { post_id } = req.params;
    const token = req.headers['x-access-token'];

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

    try {
        if (SET_string === "")
            throw { status: 400, message: "Either title or value is required" }
        const { email, password } = jwt.decode(token);
        const [[user]] = await pool.query(`SELECT id FROM users WHERE email = ? AND password = ?`, [email, password]);
        option.push(post_id, user.id);
        await pool.query(`UPDATE posts SET ${SET_string} WHERE id = ? AND user_id = ?`,option);
        res.status(204).json();
    } catch (err) {
        next(err);
    }
})

router.delete('/:post_id', async (req, res, next) => {
    const { post_id } = req.params;
    const token = req.headers['x-access-token'];

    try {
        const { email, password } = jwt.decode(token);
        const [[user]] = await pool.query(`SELECT id FROM users WHERE email = ? AND password = ?`, [email, password]);
        const [rows] = pool.query(`DELETE FROM posts WHERE user_id = ? AND id = ?`,[user.id, post_id]);
        if (rows.affectedRows === 0)
            throw { status: 410, message: '이미 삭제된 게시물입니다'}
        res.status(204).json();
    } catch (err) {
        next(err);
    }
})

router.post('/:post_id/recommend', async (req, res, next) => {
    const { post_id } = req.params;
    const token = req.headers['x-access-token'];
    try {
        const { email, password } = jwt.decode(token);
        const [[user]] = await pool.query(`SELECT id FROM users WHERE email = ? AND password = ?`, [email, password]);
        const [rows] = await pool.query(`INSERT INTO post_recommends (user_id, post_id) SELECT ?, ? FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM post_recommends WHERE user_id = ? AND post_id = ?)`,[user.id, post_id, user.id, post_id]);
        if (rows.affectedRows === 0)                            //recommend twice
            throw { status: 400, message: 'Already recommended post' }
        res.status(204).json();
    } catch (err) {
        if (err.errno === 1452 && err.sqlState === '23000') {  //not exists post_id
            err = new Error('Post not found');
            err.status = 404;
        }
        next(err);
    }
})

router.post('/:post_id/disrecommend', async (req, res, next) => {
    const { post_id } = req.params;
    const token = req.headers['x-access-token'];
    try {
        const { email, password } = jwt.decode(token);
        const [[user]] = await pool.query(`SELECT id FROM users WHERE email = ? AND password = ?`, [email, password]);
        const [rows] = await pool.query(`INSERT INTO post_disrecommends (user_id, post_id) SELECT ?, ? FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM post_disrecommends WHERE user_id = ? AND post_id = ?)`,[user.id, post_id, user.id, post_id]);
        if (rows.affectedRows === 0)                            //recommend twice
            throw { status: 400, message: 'Already recommended post' }
        res.status(204).json();
    } catch (err) {
        if (err.errno === 1452 && err.sqlState === '23000') {  //not exists post_id
            err = new Error('Post not found');
            err.status = 404;
        }
        next(err);
    }
})

router.get('/:post_id/comments', async (req, res, next) => {
    const { post_id } = req.params;
    const { limit, offset } = req.query;

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

    try {
        const [comments] = await pool.query(sql, option);
        comments.map(comment => {
            comment.comments = JSON.parse('['+comment.comments+']')
            if (comment.comments[0].id === null)
                comment.comments = [];
        })
        res.status(200).json({ comments })
    } catch (err) {
        next(err);
    }
})


router.post('/:post_id/comments', async (req, res, next) => {
    const { post_id } = req.params;
    const token = req.headers['x-access-token'];
    const { value, parent_id } = req.body;
    try {
        const { email, password } = jwt.decode(token);
        const [[user]] = await pool.query(`SELECT id FROM users WHERE email = ? AND password = ?`, [email, password]);
        await pool.query(`INSERT INTO post_comments (user_id, post_id, value, parent_id) VALUES (?, ?, ?, ?)`,[user.id, post_id, value, parent_id]);
        res.status(204).json();
    } catch (err) {
        next(err);
    }
})

router.put('/:post_id/comments/:comment_id', async (req, res, next) => {
    const { post_id, comment_id } = req.params;
    const token = req.headers['x-access-token'];
    const { value } = req.body;
    try {
        const { email, password } = jwt.decode(token);
        const [[user]] = await pool.query(`SELECT id FROM users WHERE email = ? AND password = ?`, [email, password]);
        const [rows] = await pool.query(`UPDATE post_comments SET value = ? WHERE post_id = ? AND id = ? AND user_id = ?`,[value, post_id, comment_id, user.id]);
        if (rows.affectedRows === 0)
            throw { status: 404, message: 'Comment not found' }
        res.status(204).json();
    } catch (err) {
        next(err);
    }
})

router.delete('/:post_id/comments/:comment_id', async (req, res, next) => {
    const { post_id, comment_id } = req.params;
    const token = req.headers['x-access-token'];
    try {
        const { email, password } = jwt.decode(token);
        const [[user]] = await pool.query(`SELECT id FROM users WHERE email = ? AND password = ?`, [email, password]);
        const [rows] = await pool.query(`DELETE FROM post_comments WHERE user_id = ? AND post_id = ? AND id = ?`,[user.id, post_id, comment_id]);
        if (rows.affectedRows === 0)
            throw { status: 404, message: 'Comment not found' }
        res.status(204).json();
    } catch (err) {
        next(err);
    }
})

module.exports = router;