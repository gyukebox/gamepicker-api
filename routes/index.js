const express = require('express');
const router = express.Router();

const games = require('./games');
const users = require('./users');
const posts = require('./posts');
const platforms = require('./platforms');
const admin = require('./admin');
const me = require('./me');

router.use(async (req, res, next) => {
    const auth_token = req.headers['authorization'];
    try {
        if (!auth_token) {
            throw { status: 400, code: "AUTHENTICATION_REQUIRED", message: "Authentication token required" };
        }
        const [rows] = await pool.query(`SELECT 1 FROM authorization WHERE token = ?`, [auth_token]);
        if (rows.length === 0)
            throw { status: 401, code: "AUTHENTICATION_FAILED", message: 'Invalid authentication token'};
        next();
    } catch (err) {
        next(err);
    }
})

router.use('/games', games);
router.use('/users', users);
router.use('/posts', posts);
router.use('/platforms', platforms);
router.use('/admin', admin);
router.use('/me', me);

module.exports = router;

/**
 * @apiDefine HEADERS_AUTHENTICATION
 * @apiHeader {String} Authorization Authentication token
 * @apiError AUTHENTICATION_FAILED Invalid authentication token
 * @apiError AUTHENTICATION_REQUIRED Authentication token is required
 * @apiErrorExample AUTHENTICATION_FAILED:
 *      HTTP/1.1 401 Unauthorized
 *      {
 *          "code": "AUTHENTICATION_FAILED",
 *          "message": "Invalid authentication token"
 *      }
 * @apiErrorExample AUTHENTICATION_REQUIRED:
 *      HTTP/1.1 400 Bad Request
 *      {
 *          "code": "AUTHENTICATION_REQUIRED",
 *          "message": "Authentication token is required"
 *      }
 */

/**
 * @apiDefine HEADERS_AUTHORIZATION
 * @apiHeader {String} x-access-token Authorization token
 * @apiError AUTHORIZATION_FAILED Invalid authorization token
 * @apiError AUTHORIZATION_REQUIRED Authorization token is required
 * @apiErrorExample AUTHORIZATION_FAILED:
 *      HTTP/1.1 401 Unauthorized
 *      {
 *          "code": "AUTHORIZATION_FAILED",
 *          "message": "Not enough or too many segments"
 *      }
 * @apiErrorExample AUTHORIZATION_REQUIRED:
 *      HTTP/1.1 400 Bad Request
 *      {
 *          "code": "AUTHORIZATION_REQUIRED",
 *          "message": "Authorization token is required"
 *      }
 */

/**
 * @apiDefine SUCCESS_GAME
 * @apiSuccess {Object} game
 * @apiSuccess {Number} game.id The ID of this game
 * @apiSuccess {String} game.title Title of this game
 * @apiSuccess {String} game.developer Developer of this game
 * @apiSuccess {String} game.publisher Publisher of this game
 * @apiSuccessExample Success-response:
 *      HTTP/1.1 200 OK
 *      {
 *          "id": 13,
 *          "title": "maple story"
 *      }
 */

/**
 * @apiDefine ERROR_USER_NOT_FOUND
 * @apiError USER_NOT_FOUND The ID of the User was not found
 * @apiErrorExample Error-response:
 *      HTTP/1.1 404 Not Found
 *      {
 *          "message": "User not found"
 *      }
 */

/**
 * @apiDefine ERROR_GAME_NOT_FOUND
 * @apiError GAME_NOT_FOUND The ID of the Game was not found
 * @apiErrorExample Error-response:
 *      HTTP/1.1 404 Not Found
 *      {
 *          "message": "Game not found"
 *      }
 */

/**
 * @apiDefine ERROR_COMMENT_NOT_FOUND
 * @apiError ERROR_COMMENT_NOT_FOUND The ID of the Comment was not found
 * @apiErrorExample Error-response:
 *      HTTP/1.1 404 Not Found
 *      {
 *          "message": "Comment not found"
 *      }
 */

/**
 * @apiDefine ERROR_POST_NOT_FOUND
 * @apiError POST_NOT_FOUND The ID of the Post was not found
 * @apiErrorExample Error-response:
 *      HTTP/1.1 404 Not Found
 *      {
 *          "message": "Post not found"
 *      }
 */

/**
 * @apiDefine ERROR_FILE_NOT_FOUND
 * @apiError FILE_NOT_FOUND File not found
 * @apiErrorExample Error-response:
 *      HTTP/1.1 404 Not Found
 *      {
 *          "message": "File not found"
 *      }
 */

 /**
  * @apiDefine SUCCESS_EMPTY
  * @apiSuccessExample SUCCESS:
 *      HTTP/1.1 204 No Content
 *      {
 *          
 *      }
  */

/**
 * @apiDefine QUERY_LIMIT
 * @apiParam {Number} query.limit Limit the number of items returned
 */

/**
 * @apiDefine QUERY_OFFSET
 * @apiParam {Number} query.offset Decide the start index of items returned
 */

/**
 * @apiDefine SUCCESS_GAME_COMMENTS_SIMPLE
 * @apiSuccess {Json[]} comments
 * @apiSuccess {Json} comment
 * @apiSuccess {Number} comment.id The ID of the comment
 * @apiSuccess {String} comment.value Content of the comment
 * @apiSuccessExample Success:
 *      HTTP/1.1 200 OK
 *      {
            "comments": [
                {
                    "id": 81,
                    "game_id": 43
                    "value": "This game is awesome!"
                }
            ]
        }
 */

/**
 * @apiDefine SUCCESS_POST_COMMENTS_SIMPLE
 * @apiSuccess {Json[]} comments
 * @apiSuccess {Json} comment
 * @apiSuccess {Number} comment.id The ID of the comment
 * @apiSuccess {String} comment.value Content of the comment
 * @apiSuccessExample Success:
 *      HTTP/1.1 200 OK
 *      {
            "comments": [
                {
                    "id": 81,
                    "post_id": 23
                    "value": "I like this post"
                }
            ]
        }
 */

/**
 * @apiDefine SUCCESS_POSTS
 * @apiSuccess {Json[]} posts
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
 *          "game_title": null,
            "posts": [
                {
                    "id": 139,
                    "title": "난 배스운영자다",
                    "views": 1,
                    "created_at": "2019-03-13 05:40:21",
                    "name": "개발담당",
                    "user_id": 12,
                    "category": "free",
                    "game_title": null,
                    "recommends": 0,
                    "disrecommends": 0,
                    "comment_count": 0
                }
            ]
        }
 */