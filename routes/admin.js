const express = require('express');
const router = express.Router();
const cert = require('../controller/certification')().admin;

/**
 * @api {post} /admin/questions Ask to admin
 * @apiName CreateQuestions
 * @apiGroup Admin
 * 
 * @apiUse HEADERS_AUTHENTICATION
 * 
 * @apiParam {Object} body
 * @apiParam {String} body.title Title of the question
 * @apiParam {String} body.email An email to get a response
 * @apiParam {String} body.value Content of the question
 * 
 * @apiUse SUCCESS_EMPTY
 */
router.post('/questions', async (req, res, next) => {
    const { title, email, value } = req.body;
    try {
        await pool.query(`INSERT INTO questions (title, email, value) VALUES (?, ?, ?)`,[title, email, value]);
        res.status(204).json();
    } catch (err) {
        next(err);
    }
});

/**
 * @api {get} /admin/questions Get questions from users
 * @apiName GetQuestions
 * @apiGroup Admin
 * 
 * @apiUse HEADERS_AUTHENTICATION
 * 
 * @apiParam {Object} query
 * @apiParam {String} query.sort Sorting options (answered)
 * 
 * @apiSuccess {Json[]} questions
 * @apiSuccess {Number} id The ID of the question
 * @apiSuccess {String} title Title of the question
 * @apiSuccess {String} email Email of the user
 * @apiSuccess {String} value Content of the question
 * @apiSuccess {String} reply Answer of the question
 * @apiSuccessExample Success:
 *      HTTP/1.1 200 OK
 *      {
 *          "questions": [
                {
                    "id": 1,
                    "title": "How to get authentication token?",
                    "email": "ansrl0107@gmail.com",
                    "value": "I want to use Gamepicker API",
                    "reply": null
                }
 *          ]
 *      }
 * 
 */
router.get('/questions', async (req, res, next) => {
    const { sort } = req.query;
    try {
        if (sort === 'answered') {
            const [questions] = await pool.query(`SELECT id, title, email, value, reply FROM questions WHERE reply IS NOT NULL`);
            res.status(200).json({ questions });
        } else {
            const [questions] = await pool.query(`SELECT id, title, email, value FROM questions WHERE reply IS NULL`);
            res.status(200).json({ questions });
        }
    } catch (err) {
        next(err);
    }
});

/**
 * @api {post} /admin/questions/:question-id/reply Answer the questions from users
 * @apiName ReplyQuestions
 * @apiGroup Admin
 * 
 * @apiUse HEADERS_AUTHENTICATION
 * @apiUse HEADERS_AUTHORIZATION
 * 
 * @apiParam {Object} params
 * @apiParam {Number} params.questions The ID of the question
 * @apiParam {Object} body
 * @apiParam {String} body.reply Answer of the question
 * 
 * @apiUse SUCCESS_EMPTY
 * 
 */ 
router.post('/questions/:question_id/reply', async (req, res, next) => {
    const { question_id } = req.params;
    const { reply } = req.body;
    try {
        await cert(req);
        const [rows] = await pool.query(`UPDATE questions SET reply = ? WHERE id = ?`, [reply, question_id]);
        if (rows.affectedRows === 0)
            throw { status: 404, message: 'Question not found' }
        res.status(204).json()
    } catch (err) {
        next(err);
    }
});

/**
 * @api {get} /admin/notices Get notices
 * @apiName GetNotices
 * @apiGroup Admin
 * 
 * @apiUse HEADERS_AUTHENTICATION
 * 
 * @apiParam {object} query
 * @apiUse QUERY_LIMIT
 * @apiUse QUERY_OFFSET
 * 
 * @apiSuccess {Json[]} notices 
 * @apiSuccess {Number} id The ID of the notice
 * @apiSuccess {String} title Title of the notice
 * @apiSuccess {DateTime} created_at The time this notice was added
 * @apiSuccessExample Success:
 *      HTTP/1.1 200 OK
 *      {
 *          "notices": [
                {
                    "id": 1,
                    "title": "Important notice",
                    "created_at": "2019-03-09 13:52:38"
                }
            ]
 *      }
 */
router.get('/notices', async (req, res, next) => {
    const { limit, offset } = req.query;
    let sql = `SELECT id, title, created_at FROM notices ORDER BY created_at DESC`;
    const option = [];
    if (limit) {
        sql += ` LIMIT ?`;
        option.push(Number(limit))
        if (offset) {
            sql += ` OFFSET ?`;
            option.push(Number(offset));
        }
    }
    try {
        const [notices] = await pool.query(sql, option);
        res.status(200).json({ notices })
    } catch (err) {
        next(err);
    }
});

/**
 * @api {get} /admin/notices/:notice-id Get notice
 * @apiName GetNotice
 * @apiGroup Admin
 * 
 * @apiUse HEADERS_AUTHENTICATION
 * 
 * @apiParam {Object} query
 * @apiUse QUERY_LIMIT
 * @apiUse QUERY_OFFSET
 * 
 * @apiSuccess {Json} notice
 * @apiSuccess {Number} id The ID of the notice
 * @apiSuccess {String} title Title of the notice
 * @apiSuccess {String} value Content of the notice
 * @apiSuccess {DateTime} created_at The time this notice was added
 * @apiSuccessExample Success:
 *      HTTP/1.1 200 OK
 *      {
            "notice": {
                "id": 1,
                "title": "Important notice",
                "value": "Fake data",
                "created_at": "2019-03-09 13:52:38"
            }
        }
 * 
 */
router.get('/notices/:notice_id', async (req, res, next) => {
    const { notice_id } = req.params;
    try {
        const [[notice]] = await pool.query(`SELECT id, title, value, created_at FROM notices WHERE id = ?`, [notice_id]);
        res.status(200).json({ notice });
    } catch (err) {
        next(err);
    }
});

/**
 * @api {post} /admin/notices Add notice
 * @apiName CreateNotice
 * @apiGroup Admin
 * 
 * @apiUse HEADERS_AUTHENTICATION
 * @apiUse HEADERS_AUTHORIZATION
 * 
 * @apiParam {Object} body
 * @apiParam {String} title Title of the notice
 * @apiParam {String} value Content of the notice
 * 
 * @apiUse SUCCESS_EMPTY
 */
router.post('/notices', async (req, res, next) => {
    const { title, value } = req.body;
    try {
        await cert(req);
        await pool.query(`INSERT INTO notices (title, value) VALUES (?, ?)`,[title, value]);
        res.status(204).json()
    } catch (err) {
        next(err);
    }
});

/**
 * @api {delete} /admin/notices/:notice-id Delete notice
 * @apiName DeleteNotice
 * @apiGroup Admin
 * 
 * @apiUse HEADERS_AUTHENTICATION
 * @apiUse HEADERS_AUTHORIZATION
 * 
 * @apiParam {Object} params
 * @apiParam {Number} params.notice-id The ID of the notice
 * 
 * @apiUse SUCCESS_EMPTY
 */
router.delete('/notices/:notice_id', async (req, res, next) => {
    const { notice_id } = req.params;
    try {
        await cert(req);
        await pool.query(`DELETE FROM notices WHERE id = ?`[notice_id]);
        res.status(204).json();
    } catch (err) {
        next(err);
    }
});

/**
 * @api {post} /admin/push Send push notification
 * @apiName SendPushNotification
 * @apiGroup Admin
 * 
 * @apiUse HEADERS_AUTHENTICATION
 * @apiUse HEADERS_AUTHORIZATION
 * 
 * @apiParam {Object} body
 * 
 * @apiDeprecated Consider specific conditions.
 */
router.post('/push', async (req, res, next) => {
    const { age, gender, lastLogin, reserve } = req.body;
    const { title, content } = req.body;
    const push = require('../controller/push-notification');
    try {
        await cert(req);
        await push(age, lastLogin, gender, reserve, title, content);
        res.status(204).json();
    } catch (err) {
        next(err);
    }
});

/**
 * @api {get} /admin/report Get reported posts, comments
 * @apiName GetReports
 * @apiGroup Admin
 * 
 * @apiUse HEADERS_AUTHENTICATION
 * @apiUse HEADERS_AUTHORIZATION
 * 
 * @apiSuccess {Json[]} posts
 * @apiSuccess {Json} post
 * @apiSuccess {Number} post.id The ID of the post
 * @apiSuccess {String} post.title Title of the post
 * @apiSuccess {Number} post.count Number of reports
 * @apiSuccess {Json[]} comments
 * @apiSuccess {Number} comment.id The ID of the comment
 * @apiSuccess {String} comment.value Content of the comment
 * @apiSuccess {Number} comment.post_id The ID of the post related the comment
 * @apiSuccess {Number} comment.count Number of reports
 * 
 */
router.get('/report', async (req, res ,next) => {
    try {
        await cert(req);
        const [posts] = await pool.query(`
            SELECT posts.id, posts.title, COUNT(report.user_id) AS count
            FROM report LEFT JOIN posts ON posts.id = report.post_id
            WHERE report.comment_id IS NULL
            GROUP BY post_id`);
        const [comments] = await pool.query(`
            SELECT post_comments.id, post_comments.value, post_comments.post_id, COUNT(report.user_id) AS count
            FROM report LEFT JOIN post_comments ON post_comments.id = report.comment_id
            WHERE report.post_id IS NULL
            GROUP BY comment_id`);
        res.status(200).json({ posts, comments });
    } catch (err) {
        next(err);
    }
});

/**
 * @api {delete} /admin/posts/:post-id Forces to delete post
 * @apiName ForceDeletePost
 * @apiGroup Admin
 * 
 * @apiUse HEADERS_AUTHENTICATION
 * @apiUse HEADERS_AUTHORIZATION
 * 
 * @apiUse SUCCESS_EMPTY
 */
router.delete('/posts/:post_id', async (req, res, next) => {
    const { post_id } = req.params;
    try {
        await cert(req);
        await pool.query(`DELETE FROM posts WHERE id = ?`, [post_id]);
        res.status(204).json();
    } catch (err) {
        next(err);
    }
});

/**
 * @api {delete} /admin/posts/:post-id/comments/:comment-id Forces to delete post comment
 * @apiName ForceDeletePostComment
 * @apiGroup Admin
 * 
 * @apiUse HEADERS_AUTHENTICATION
 * @apiUse HEADERS_AUTHORIZATION
 * 
 * @apiUse SUCCESS_EMPTY
 */
router.delete('/posts/:post_id/comments/:comment_id', async (req, res, next) => {
    const { post_id, comment_id } = req.params;
    try {
        await cert(req);
        await pool.query(`DELETE FROM post_comments WHERE id = ? AND post_id = ?`, [comment_id, post_id]);
        res.status(204).json();
    } catch (err) {
        next(err);
    }
});
module.exports = router;