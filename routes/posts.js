const express = require('express');
const router = express.Router();
const cert = require('../controller/certification')().user;

router.get('/', async (req, res, next) => {
    const { limit, offset, game_id, category } = req.query;
    let sql = `
    SELECT
        posts.id, posts.title, views, posts.created_at,
        users.name, users.id as user_id,  
        (SELECT COUNT(1) FROM post_recommends WHERE post_id = posts.id) as recommends,
        (SELECT COUNT(1) FROM post_disrecommends WHERE post_id = posts.id) as disrecommends,
        (SELECT COUNT(1) FROM post_comments WHERE post_id = posts.id) as comment_count
    FROM
        posts
        LEFT JOIN users ON users.id = posts.user_id
        LEFT JOIN games ON games.id = posts.game_id
        LEFT JOIN post_category ON post_category.id = posts.category_id`
    const option = [];
    if (category) {
        sql += ` WHERE post_category.value = ?`;
        option.push(category);
        if (category === 'games' && game_id) {
            sql += ` AND game_id = ?`;
            option.push(Number(game_id));
        }
    }
    sql += ` GROUP BY posts.id ORDER BY posts.created_at DESC`
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
    const token = req.headers['x-access-token'];
    const sql = `
    SELECT
        posts.id, posts.title, views, posts.value, posts.created_at,
        users.name, users.id as user_id,  
        games.title AS game_title, games.id AS game_id,
        post_category.value AS category,
        (SELECT COUNT(1) FROM post_recommends WHERE post_id = posts.id) AS recommends,
        (SELECT COUNT(1) FROM post_disrecommends WHERE post_id = posts.id) AS disrecommends
    FROM
        posts
        LEFT JOIN users ON users.id = posts.user_id
        LEFT JOIN games ON games.id = posts.game_id
        LEFT JOIN post_category ON post_category.id = posts.category_id
    WHERE posts.id = ?`

    try {
        const [[post]] = await pool.query(sql, [post_id]);
        await pool.query(`UPDATE posts SET views = views+1 WHERE id = ?`, [post_id]);
        if (!post)
            throw { status: 404, message: 'Post not found' }
        post.recommended = false;
        post.disrecommended = false;
        if (token) {
            const user_id = await cert(req);
            const [recommend] = await pool.query(`SELECT * FROM post_recommends WHERE user_id = ? AND post_id = ?`, [user_id, post_id]);
            post.recommended = !!recommend.length;
            const [disrecommend] = await pool.query(`SELECT * FROM post_disrecommends WHERE user_id = ? AND post_id = ?`, [user_id, post_id]);
            post.disrecommended = !!disrecommend.length;
        }
        res.status(200).json({ post })
    } catch (err) {
        next(err);
    }
})

router.post('/', async (req, res, next) => {
    const { title, value, game_id, category } = req.body;
    try {
        const user_id = await cert(req);
        if (category === 'games') {    // games
            await pool.query(`INSERT INTO posts (user_id, title, value, game_id, category_id) VALUES (?, ?, ?, ?, (SELECT id FROM post_category WHERE value = ?))`,[user_id, title, value, game_id, category]);
        } else {    //free(2), anonymous(3)
            await pool.query(`INSERT INTO posts (user_id, title, value, category_id) VALUES (?, ?, ?, (SELECT id FROM post_category WHERE value = ?))`,[user_id, title, value, category]);
        }
        res.status(204).json();
    } catch (err) {
        next(err);
    }
})

//제목, 내용중 내용만 변경하게 할까?
router.put('/:post_id', async (req, res, next) => {
    const { post_id } = req.params;

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
        const user_id = await cert(req);
        option.push(post_id, user_id);
        await pool.query(`UPDATE posts SET ${SET_string} WHERE id = ? AND user_id = ?`,option);
        res.status(204).json();
    } catch (err) {
        next(err);
    }
})

router.delete('/:post_id', async (req, res, next) => {
    const { post_id } = req.params;
    try {
        const user_id = await cert(req);
        await pool.query(`DELETE FROM posts WHERE user_id = ? AND id = ?`,[user_id, post_id]);
        res.status(204).json();
    } catch (err) {
        next(err);
    }
})

router.get('/:post_id/recommend', async (req, res, next) => {
    const { post_id } = req.params;
    try {
        const user_id = await cert(req);
        const [rows] = await pool.query(`SELECT 1 FROM post_recommends WHERE user_id = ? AND post_id = ?`, [user_id, post_id]);
        const recommend = !!rows.length;
        res.status(200).json({ recommend });
    } catch (err) {
        next(err);
    }
});

router.post('/:post_id/recommend', async (req, res, next) => {
    const { post_id } = req.params;
    try {
        const user_id = await cert(req);
        const [rows] = await pool.query(`INSERT INTO post_recommends (user_id, post_id) SELECT ?, ? FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM post_recommends WHERE user_id = ? AND post_id = ?)`,[user_id, post_id, user_id, post_id]);
        if (rows.affectedRows === 0)                            //recommend twice
            throw { status: 400, message: 'Already recommended post' }
        res.status(204).json();
    } catch (err) {
        if (err.errno === 1452) {  //not exists post_id
            err = new Error('Post not found');
            err.status = 404;
        }
        next(err);
    }
});

router.delete('/:post_id/recommend', async (req, res, next) => {
    const { post_id } = req.params;
    try {
        const user_id = await cert(req);
        await pool.query(`DELETE FROM post_recommends WHERE user_id = ? AND post_id = ?`, [user_id, post_id]);
        res.status(204).json();
    } catch (err) {
        next(err);
    }   
});

router.get('/:post_id/disrecommend', async (req, res, next) => {
    const { post_id } = req.params;
    try {
        const user_id = await cert(req);
        const [rows] = await pool.query(`SELECT 1 FROM post_disrecommends WHERE user_id = ? AND post_id = ?`, [user_id, post_id]);
        const disrecommend = !!rows.length;
        res.status(200).json({ disrecommend });
    } catch (err) {
        next(err);
    }
});

router.post('/:post_id/disrecommend', async (req, res, next) => {
    const { post_id } = req.params;
    try {
        const user_id = await cert(req);
        const [rows] = await pool.query(`INSERT INTO post_disrecommends (user_id, post_id) SELECT ?, ? FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM post_disrecommends WHERE user_id = ? AND post_id = ?)`,[user_id, post_id, user_id, post_id]);
        if (rows.affectedRows === 0)                            //recommend twice
            throw { status: 400, message: 'Already recommended post' }
        res.status(204).json();
    } catch (err) {
        if (err.errno === 1452) {  //not exists post_id
            err = new Error('Post not found');
            err.status = 404;
        }
        next(err);
    }
});

router.delete('/:post_id/disrecommend', async (req, res, next) => {
    const { post_id } = req.params;
    try {
        const user_id = await cert(req);
        await pool.query(`DELETE FROM post_disrecommends WHERE user_id = ? AND post_id = ?`, [user_id, post_id]);
        res.status(204).json();
    } catch (err) {
        next(err);
    }   
});

router.get('/:post_id/comments', async (req, res, next) => {
    const { post_id } = req.params;
    const { limit, offset } = req.query;

    let sql = `
    SELECT 
        p.id, p.value, p.created_at, p.user_id,
        (SELECT name FROM users WHERE id = p.user_id) AS name, 
        (SELECT COUNT(*) FROM post_comment_recommends WHERE comment_id = p.id) AS recommends,
        (SELECT COUNT(*) FROM post_comment_disrecommends WHERE comment_id = p.id) AS disrecommends, 
        GROUP_CONCAT(
            JSON_OBJECT(
                "id",c.id, 
                "value",c.value, 
                "user_id",c.user_id,
                "created_at",c.created_at,
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
    const { value, parent_id } = req.body;
    try {
        const user_id = await cert(req);
        await pool.query(`INSERT INTO post_comments (user_id, post_id, value, parent_id) VALUES (?, ?, ?, ?)`,[user_id, post_id, value, parent_id]);
        const push = require('../controller/notification');
        if (parent_id) {
            const [[write_user]] = await pool.query(`SELECT name FROM users WHERE id = ?`, [user_id]);
            const [[user]] = await pool.query(`SELECT reg_id, users.id FROM post_comments LEFT JOIN users ON users.id = post_comments.user_id WHERE post_comments.id = ?`, [parent_id]);
            if (user.reg_id && user.id !== user_id) {
                await push(user.reg_id, {
                    body: write_user.name + '님이 회원님의 댓글에 답글을 남겻습니다.'
                },{
                    post_id,
                    comment_id: parent_id
                });
            }
        } else {
            const [[write_user]] = await pool.query(`SELECT name FROM users WHERE id = ?`, [user_id]);
            const [[user]] = await pool.query(`SELECT reg_id, users.id FROM posts LEFT JOIN users ON users.id = posts.user_id WHERE posts.id = ?`, [post_id]);
            if (user.reg_id && user.id !== user_id) {
                await push(user.reg_id, {
                    body: write_user.name + '님이 회원님의 게시물에 댓글을 남겻습니다.'
                },{
                    post_id
                });
            }
        }
        res.status(204).json();
    } catch (err) {
        next(err);
    }
})

router.put('/:post_id/comments/:comment_id', async (req, res, next) => {
    const { post_id, comment_id } = req.params;
    const { value } = req.body;
    try {
        const user_id = await cert(req);
        const [rows] = await pool.query(`UPDATE post_comments SET value = ? WHERE post_id = ? AND id = ? AND user_id = ?`,[value, post_id, comment_id, user_id]);
        if (rows.affectedRows === 0)
            throw { status: 404, message: 'Comment not found' }
        res.status(204).json();
    } catch (err) {
        next(err);
    }
})

router.delete('/:post_id/comments/:comment_id', async (req, res, next) => {
    const { post_id, comment_id } = req.params;
    try {
        const user_id = await cert(req);
        const [rows] = await pool.query(`DELETE FROM post_comments WHERE user_id = ? AND post_id = ? AND id = ?`,[user_id, post_id, comment_id]);
        if (rows.affectedRows === 0)
            throw { status: 404, message: 'Comment not found' }
        res.status(204).json();
    } catch (err) {
        next(err);
    }
})

router.post('/:post_id/comments/:comment_id/recommends', async (req, res, next) => {
    const { post_id, comment_id } = req.params;
    try {
        const user_id = await cert(req);
        await pool.query(`INSERT INTO post_comment_recommends (user_id, comment_id) VALUES (?, ?)`, [user_id, comment_id]);
        res.status(204).json();
    } catch (err) {
        next(err);
    }
});

router.delete('/:post_id/comments/:comment_id/recommends', async (req, res, next) => {
    const { post_id, comment_id } = req.params;
    try {
        const user_id = await cert(req);
        await pool.query(`DELETE FROM post_comment_recommends WHERE user_id = ? AND comment_id = ?`, [user_id, comment_id]);
        res.status(204).json();
    } catch (err) {
        next(err);
    }
});

router.post('/:post_od/comments/:comment_id/disrecommends', async (req, res, next) => {
    const { post_id, comment_id } = req.params;
    try {
        const user_id = await cert(req);
        await pool.query(`INSERT INTO post_comment_disrecommends (user_id, comment_id) VALUES (?, ?)`, [user_id, comment_id]);
        res.status(204).json();
    } catch (err) {
        next(err);
    }
});

router.delete('/:post_id/comments/:comment_id/disrecommends', async (req, res, next) => {
    const { post_id, comment_id } = req.params;
    try {
        const user_id = await cert(req);
        await pool.query(`DELETE FROM post_comment_disrecommends WHERE user_id = ? AND comment_id = ?`, [user_id, comment_id]);
        res.status(204).json();
    } catch (err) {
        next(err);
    }
});
module.exports = router;