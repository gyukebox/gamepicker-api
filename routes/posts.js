const express = require('express');
const router = express.Router();
const cert = require('../controller/certification')();

/**
 * @api {get} /posts Get posts
 * @apiName GetPosts
 * @apiGroup Posts
 * 
 * @apiUse HEADERS_AUTHENTICATION
 * @apiUse HEADERS_AUTHORIZATION
 * 
 * @apiParam {Object} query
 * @apiUse QUERY_LIMIT
 * @apiUse QUERY_OFFSET
 * @apiParam {String} query.category Get posts related with category
 * @apiParam {Number} query.game_id Get posts related with game_id
 * 
 * @apiSuccess {String} game_title Title of game related posts
 * @apiUse SUCCESS_POSTS
 * 
 */
router.get('/', async (req, res, next) => {
    const { limit, offset, game_id, category } = req.query;
    let sql = ` 
    SELECT
        posts.id, posts.title, views, posts.created_at,
        users.name, users.id as user_id,  
        post_category.value AS category,
        games.title AS game_title,
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
    } else {
        sql += ` WHERE post_category.value IN ('free', 'games', 'anonymous')`;
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
        let game_title = null;
        if (game_id && category === 'games') {
            const [[tmp]] = await pool.query(`SELECT title FROM games WHERE id = ?`, [game_id]);
            game_title = tmp.title;
        }
        res.status(200).json({ posts, game_title });
    } catch (err) {
        next(err);
    }
})

/**
 * @api {get} /posts Get post
 * @apiName GetPost
 * @apiGroup Posts
 * 
 * @apiUse HEADERS_AUTHENTICATION
 * @apiUse HEADERS_AUTHORIZATION
 * 
 * @apiSuccess {Json} post
 * @apiSuccess {Number} post.id The ID of the post
 * @apiSuccess {String} post.title Title of the post
 * @apiSuccess {Number} post.views Views of the post
 * @apiSuccess {DateTime} post.created_at The time the post was added
 * @apiSuccess {Number} post.user_id The ID of the writer
 * @apiSuccess {String} post.name Name of the writer
 * @apiSuccess {String} post.category Category of the post
 * @apiSuccess {String} post.game_title Title of the game related post
 * @apiSuccess {Number} post.recommends Number of post recommends
 * @apiSuccess {Number} post.disrecommends Number of post disrecommends
 * @apiSuccess {Number} post.comment_count Number of post comments
 * @apiSuccessExample Success:
 *      HTTP/1.1 200 OK
 *      {
            "post": {
                "id": 139,
                "title": "난 배스운영자다",
                "views": 1,
                "created_at": "2019-03-13 05:40:21",
                "value": "dsadsadsadsadas",
                "name": "개발담당",
                "user_id": 12,
                "category": "free",
                "game_title": null,
                "recommends": 0,
                "disrecommends": 0,
                "comment_count": 0
            }
        }
 * 
 */
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
            const user_id = await cert.user(req);
            const [recommend] = await pool.query(`SELECT * FROM post_recommends WHERE user_id = ? AND post_id = ?`, [user_id, post_id]);
            post.recommended = !!recommend.length;
            const [disrecommend] = await pool.query(`SELECT * FROM post_disrecommends WHERE user_id = ? AND post_id = ?`, [user_id, post_id]);
            post.disrecommended = !!disrecommend.length;
        }
        res.status(200).json({ post });
    } catch (err) {
        next(err);
    }
});

/**
 * @api {post} /posts Add post
 * @apiName AddPost
 * @apiGroup Posts
 * 
 * @apiUse HEADERS_AUTHENTICATION
 * @apiUse HEADERS_AUTHORIZATION
 * 
 * @apiParam {Object} body
 * @apiParam {String} body.title Title of the post
 * @apiParam {String} body.value Content of the post
 * @apiParam {Number} body.game_id The ID of the game related post (optional)
 * @apiParam {String} body.category Category of the post (games, news, event, free, anonymous, wiki)
 * 
 * @apiUse SUCCESS_EMPTY
 */
router.post('/', async (req, res, next) => {
    const { title, value, game_id, category } = req.body;
    try {
        const user_id = await cert.user(req);
        if (category === 'games') {    // games(1)
            await pool.query(`INSERT INTO posts (user_id, title, value, game_id, category_id) VALUES (?, ?, ?, ?, (SELECT id FROM post_category WHERE value = ?))`,[user_id, title, value, game_id, category]);
        } else if (category === 'news' || category === 'event') {
            const admin_id = await cert.admin(req);
            await pool.query(`INSERT INTO posts (user_id, title, value, category_id) VALUES (?, ?, ?, (SELECT id FROM post_category WHERE value = ?))`,[admin_id, title, value, category])
        } else {    //free(2), anonymous(3), wiki(6)
            await pool.query(`INSERT INTO posts (user_id, title, value, category_id) VALUES (?, ?, ?, (SELECT id FROM post_category WHERE value = ?))`,[user_id, title, value, category]);
        }
        res.status(204).json();
    } catch (err) {
        next(err);
    }
})

/**
 * @api {put} /posts/:post-id Update post
 * @apiName UpdatePost
 * @apiGroup Posts
 * 
 * @apiUse HEADERS_AUTHENTICATION
 * @apiUse HEADERS_AUTHORIZATION
 * 
 * @apiParam {Object} params
 * @apiParam {Number} params.post-id The ID of the post
 * @apiParam {Object} body
 * @apiParam {String} body.value Content of the post
 * 
 * @apiUse SUCCESS_EMPTY
 */
router.put('/:post_id', async (req, res, next) => {
    const { post_id } = req.params;
    const { value } = req.body;
    try {
        const user_id = await cert.user(req);
        await pool.query(`UPDATE posts SET value = ? WHERE id = ? AND user_id = ?`,[value, post_id, user_id]);
        res.status(204).json();
    } catch (err) {
        next(err);
    }
});

/**
 * @api {delete} /posts/:post-id Delete post
 * @apiName DeletePost
 * @apiGroup Posts
 * 
 * @apiUse HEADERS_AUTHENTICATION
 * @apiUse HEADERS_AUTHORIZATION
 * 
 * @apiParam {Object} params
 * @apiParam {Number} params.post-id The ID of the post
 * 
 * @apiUse SUCCESS_EMPTY
 */
router.delete('/:post_id', async (req, res, next) => {
    const { post_id } = req.params;
    try {
        const user_id = await cert.user(req);
        await pool.query(`DELETE FROM posts WHERE user_id = ? AND id = ?`,[user_id, post_id]);
        res.status(204).json();
    } catch (err) {
        next(err);
    }
});

/**
 * @api {get} /posts/:post-id/recommend Recommend post
 * @apiName RecommendPost
 * @apiGroup Posts
 * 
 * @apiDeprecated performance issue
 */
router.get('/:post_id/recommend', async (req, res, next) => {
    const { post_id } = req.params;
    try {
        const user_id = await cert.user(req);
        const [rows] = await pool.query(`SELECT 1 FROM post_recommends WHERE user_id = ? AND post_id = ?`, [user_id, post_id]);
        const recommend = !!rows.length;
        res.status(200).json({ recommend });
    } catch (err) {
        next(err);
    }
});

/**
 * @api {post} /posts/:post-id/recommend Recommend post
 * @apiName RecommendPost
 * @apiGroup Posts
 * 
 * @apiUse HEADERS_AUTHENTICATION
 * @apiUse HEADERS_AUTHORIZATION
 * 
 * @apiParam {Object} params
 * @apiParam {Number} params.post-id The ID of the post
 * 
 * @apiUse SUCCESS_EMPTY 
 * 
 * @apiUse ERROR_POST_NOT_FOUND
 * @apiError RECOMMEND_DUPLICATE Already recommend this post
 * @apiErrorExample RECOMMEND_DUPLICATE:
 *      HTTP/1.1 409 Conflict
 *      {
 *          code: "RECOMMEND_DUPLICATE",
 *          "message": "Already recommend this post"
 *      }
 */
router.post('/:post_id/recommend', async (req, res, next) => {
    const { post_id } = req.params;
    try {
        const user_id = await cert.user(req);
        await pool.query(`INSERT INTO post_recommends (user_id, post_id) VALUES (?, ?)`,[user_id, post_id]);
        res.status(204).json();
    } catch (err) {
        if (err.errno === 1062) {
            next({status: 409, code:"RECOMMEND_DUPLICATE", message: "Already recommend this post"});
        } else if (err.errno === 1452) {
            next({status: 404, code: "POST_NOT_FOUND", message: "Post not found"});
        } else {
            next(err);
        }
    }
});

/**
 * @api {post} /posts/:post-id/recommend Cancle recommend post
 * @apiName CancleRecommendPost
 * @apiGroup Posts
 * 
 * @apiUse HEADERS_AUTHENTICATION
 * @apiUse HEADERS_AUTHORIZATION
 * 
 * @apiParam {Object} params
 * @apiParam {Number} params.post-id The ID of the post
 * 
 * @apiUse SUCCESS_EMPTY 
 * 
 */
router.delete('/:post_id/recommend', async (req, res, next) => {
    const { post_id } = req.params;
    try {
        const user_id = await cert.user(req);
        await pool.query(`DELETE FROM post_recommends WHERE user_id = ? AND post_id = ?`, [user_id, post_id]);
        res.status(204).json();
    } catch (err) {
        next(err);
    }   
});

/**
 * @api {get} /posts/:post-id/disrecommend check post 
 * @apiName RecommendPost
 * @apiGroup Posts
 * 
 * @apiDeprecated performance issue
 */
router.get('/:post_id/disrecommend', async (req, res, next) => {
    const { post_id } = req.params;
    try {
        const user_id = await cert.user(req);
        const [rows] = await pool.query(`SELECT 1 FROM post_disrecommends WHERE user_id = ? AND post_id = ?`, [user_id, post_id]);
        const disrecommend = !!rows.length;
        res.status(200).json({ disrecommend });
    } catch (err) {
        next(err);
    }
});

/**
 * @api {post} /posts/:post-id/disrecommend Disrecommend post
 * @apiName RecommendPost
 * @apiGroup Posts
 * 
 * @apiUse HEADERS_AUTHENTICATION
 * @apiUse HEADERS_AUTHORIZATION
 * 
 * @apiParam {Object} params
 * @apiParam {Number} params.post-id The ID of the post
 * 
 * @apiUse SUCCESS_EMPTY 
 * 
 * @apiUse ERROR_POST_NOT_FOUND
 * @apiError DISRECOMMEND_DUPLICATE Already disrecommend this post
 * @apiErrorExample DISRECOMMEND_DUPLICATE:
 *      HTTP/1.1 409 Conflict
 *      {
 *          code: "DISRECOMMEND_DUPLICATE",
 *          "message": "Already disrecommend this post"
 *      }
 */
router.post('/:post_id/disrecommend', async (req, res, next) => {
    const { post_id } = req.params;
    try {
        const user_id = await cert.user(req);
        await pool.query(`INSERT INTO post_disrecommends (user_id, post_id) VALUES (?, ?)`,[user_id, post_id]);
        res.status(204).json();
    } catch (err) {
        if (err.errno === 1062) {
            next({status: 409, code:"DISRECOMMEND_DUPLICATE", message: "Already disrecommend this post"});
        } else if (err.errno === 1452) {
            next({status: 404, code: "POST_NOT_FOUND", message: "Post not found"});
        } else {
            next(err);
        }
    }
});

/**
 * @api {post} /posts/:post-id/recommend Cancle disrecommend post
 * @apiName CancleDisrecommendPost
 * @apiGroup Posts
 * 
 * @apiUse HEADERS_AUTHENTICATION
 * @apiUse HEADERS_AUTHORIZATION
 * 
 * @apiParam {Object} params
 * @apiParam {Number} params.post-id The ID of the post
 * 
 * @apiUse SUCCESS_EMPTY 
 * 
 */
router.delete('/:post_id/disrecommend', async (req, res, next) => {
    const { post_id } = req.params;
    try {
        const user_id = await cert.user(req);
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

/**
 * @api {post} /posts/:post-id/comments Add post comment
 * @apiName AddPostComment
 * @apiGroup Posts
 * 
 * @apiUse HEADERS_AUTHENTICATION
 * @apiUse HEADERS_AUTHORIZATION
 * 
 * @apiParam {Object} params
 * @apiParam {Number} params.post-id The ID of the post
 * @apiParam {Object} body
 * @apiParam {String} body.value Content of the comment
 * @apiParam {Number} body.parent_id=null Parent comment ID
 */
router.post('/:post_id/comments', async (req, res, next) => {
    const { post_id } = req.params;
    const { value, parent_id } = req.body;
    try {
        const user_id = await cert.user(req);
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
});

/**
 * @api {put} /posts/:post-id/comments/:comment-id Update post comment
 * @apiName UpdatePostComment
 * @apiGroup Posts
 * 
 * @apiUse HEADERS_AUTHENTICATION
 * @apiUse HEADERS_AUTHORIZATION
 * 
 * @apiParam {Object} params
 * @apiParam {Number} params.post-id The ID of the post
 * @apiParam {Number} params.comment-id The ID of the comment
 * @apiParam {Object} body
 * @apiParam {String} body.value Content of the comment
 * 
 * @apiUse SUCCESS_EMPTY
 * 
 * @apiUse ERROR_COMMENT_NOT_FOUND
 */
router.put('/:post_id/comments/:comment_id', async (req, res, next) => {
    const { post_id, comment_id } = req.params;
    const { value } = req.body;
    try {
        const user_id = await cert.user(req);
        await pool.query(`UPDATE post_comments SET value = ? WHERE post_id = ? AND id = ? AND user_id = ?`,[value, post_id, comment_id, user_id]);
        res.status(204).json();
    } catch (err) {
        if (err.errno === 1452) {
            next({status: 404, code: "COMMENT_NOT_FOUND", message: "Comment not found"});
        } else {
            next(err);
        }
    }
});

/**
 * @api {delete} /posts/:post-id/comments/:comment-id Delete post comment
 * @apiName DeletePostComment
 * @apiGroup Posts
 * 
 * @apiUse HEADERS_AUTHENTICATION
 * @apiUse HEADERS_AUTHORIZATION
 * 
 * @apiParam {Object} params
 * @apiParam {Number} params.post-id The ID of the post
 * @apiParam {Number} params.comment-id The ID of the comment
 * 
 * @apiUse SUCCESS_EMPTY
 */
router.delete('/:post_id/comments/:comment_id', async (req, res, next) => {
    const { post_id, comment_id } = req.params;
    try {
        const user_id = await cert.user(req);
        await pool.query(`DELETE FROM post_comments WHERE user_id = ? AND post_id = ? AND id = ?`,[user_id, post_id, comment_id]);
        res.status(204).json();
    } catch (err) {
        next(err);
    }
});

/**
 * @api {post} /posts/:post-id/comments/:comment-id/recommends Recommend post comment
 * @apiName RecommendPostComment
 * @apiGroup Posts
 * 
 * @apiUse HEADERS_AUTHENTICATION
 * @apiUse HEADERS_AUTHORIZATION
 * 
 * @apiParam {Object} params
 * @apiParam {Number} params.post-id The ID of the post
 * @apiParam {Number} params.comment-id The ID of the comment
 * 
 * @apiUse SUCCESS_EMPTY
 */
router.post('/:post_id/comments/:comment_id/recommends', async (req, res, next) => {
    const { post_id, comment_id } = req.params;
    try {
        const user_id = await cert.user(req);
        await pool.query(`INSERT INTO post_comment_recommends (user_id, comment_id) VALUES (?, ?)`, [user_id, comment_id]);
        res.status(204).json();
    } catch (err) {
        next(err);
    }
});

/**
 * @api {delete} /posts/:post-id/comments/:comment-id/recommends Cancel recommend post comment
 * @apiName CancelRecommendPostComment
 * @apiGroup Posts
 * 
 * @apiUse HEADERS_AUTHENTICATION
 * @apiUse HEADERS_AUTHORIZATION
 * 
 * @apiParam {Object} params
 * @apiParam {Number} params.post-id The ID of the post
 * @apiParam {Number} params.comment-id The ID of the comment
 * 
 * @apiUse SUCCESS_EMPTY
 */
router.delete('/:post_id/comments/:comment_id/recommends', async (req, res, next) => {
    const { post_id, comment_id } = req.params;
    try {
        const user_id = await cert.user(req);
        await pool.query(`DELETE FROM post_comment_recommends WHERE user_id = ? AND comment_id = ?`, [user_id, comment_id]);
        res.status(204).json();
    } catch (err) {
        next(err);
    }
});

/**
 * @api {post} /posts/:post-id/comments/:comment-id/disrecommends Disrecommend post comment
 * @apiName DisrecommendPostComment
 * @apiGroup Posts
 * 
 * @apiUse HEADERS_AUTHENTICATION
 * @apiUse HEADERS_AUTHORIZATION
 * 
 * @apiParam {Object} params
 * @apiParam {Number} params.post-id The ID of the post
 * @apiParam {Number} params.comment-id The ID of the comment
 * 
 * @apiUse SUCCESS_EMPTY
 */
router.post('/:post_od/comments/:comment_id/disrecommends', async (req, res, next) => {
    const { post_id, comment_id } = req.params;
    try {
        const user_id = await cert.user(req);
        await pool.query(`INSERT INTO post_comment_disrecommends (user_id, comment_id) VALUES (?, ?)`, [user_id, comment_id]);
        res.status(204).json();
    } catch (err) {
        next(err);
    }
});

/**
 * @api {delete} /posts/:post-id/comments/:comment-id/disrecommends Cancle disrecommend post comment
 * @apiName CancleDisrecommendPostComment
 * @apiGroup Posts
 * 
 * @apiUse HEADERS_AUTHENTICATION
 * @apiUse HEADERS_AUTHORIZATION
 * 
 * @apiParam {Object} params
 * @apiParam {Number} params.post-id The ID of the post
 * @apiParam {Number} params.comment-id The ID of the comment
 * 
 * @apiUse SUCCESS_EMPTY
 */
router.delete('/:post_id/comments/:comment_id/disrecommends', async (req, res, next) => {
    const { post_id, comment_id } = req.params;
    try {
        const user_id = await cert.user(req);
        await pool.query(`DELETE FROM post_comment_disrecommends WHERE user_id = ? AND comment_id = ?`, [user_id, comment_id]);
        res.status(204).json();
    } catch (err) {
        next(err);
    }
});
module.exports = router;