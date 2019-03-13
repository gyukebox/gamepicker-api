const express = require('express');
const router = express.Router();
const fs = require('fs');
const jwt = require('../model/jwt');
const cert = require('../controller/certification')().user;

/**
 * @api {get} /users Get users
 * @apiName GetUsers
 * @apiGroup Users
 * 
 * @apiUse HEADERS_AUTHENTICATION
 * 
 * @apiParam {Object} query
 * @apiParam {String} query.name Returns the user corresponding to the name
 * @apiParam {String} query.email Returns the user corresponding to the email
 * 
 * @apiSuccess {Json[]} users
 * @apiSuccess {Number} id The ID of the user
 * @apiSuccess {String} email Email of the user
 * @apiSuccess {String} name Name of the user
 * @apiSuccessExample Success:
 *      HTTP/1.1 200 OK
        {
            "users": [
                {
                    "id": 2,
                    "email": "ansrl0107@gmail.com",
                    "name": "smk0107"
                }
            ]
        }
 */
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

/**
 * @api {get} /users/:user-id Get user
 * @apiName GetUser
 * @apiGroup Users
 * 
 * @apiUse HEADERS_AUTHENTICATION
 * 
 * @apiParam {Object} params
 * @apiParam {Number} user-id The ID of the user
 * 
 * @apiSuccess {Json} user
 * @apiSuccess {String} user.name Name of the user
 * @apiSuccess {String} user.email Email of the user
 * @apiSuccess {Date} user.birthday Birthday of the user
 * @apiSuccess {String} user.introduce Introduce of the user
 * @apiSuccess {Number} user.points Points of the user
 * @apiSuccess {String} user.gender Gender of the user
 * @apiSuccess {String} user.profile Image link that provide user's profile picture
 * @apiSuccessExample Success:
 *      HTTP/1.1 200 OK
 *      {
            "user": {
                "name": "smk0107",
                "email": "ansrl0107@gmail.com",
                "birthday": "1998-01-07",
                "introduce": null,
                "gender": "M",
                "points": 0,
                "profile": null
            }
        }
 */
router.get('/:user_id', async (req, res, next) => {
    const { user_id } = req.params;
    try {
        const [[user]] = await pool.query(`SELECT name, email, birthday, introduce, gender, points FROM users WHERE id = ?`,[user_id]);
        if (!user)
            throw { status: 404, code: "USER_NOT_FOUND", message: 'User not found' }
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

/**
 * @api {get} /users/:user-id/posts Get posts user created
 * @apiName GetUserPosts
 * @apiGroup Users
 * 
 * @apiUse HEADERS_AUTHENTICATION
 * 
 * @apiParam {Object} params
 * @apiParam {Number} user-id The ID of the user
 * @apiParam {Object} query
 * @apiUse QUERY_LIMIT
 * @apiUse QUERY_OFFSET
 * 
 * @apiSuccess {Json[]} posts
 * @apiSuccess {Json} post
 * @apiSuccess {Number} post.id The ID of the post
 * @apiSuccess {String} post.title Title of the post
 * @apiSuccess {Number} post.views Views of the post
 * @apiSuccess {DateTime} post.created_at The time the post was added
 * @apiSuccess {String} post.category Category of the post
 * @apiSuccess {Number} posts.recommends Recommends count of the post
 * @apiSuccess {Number} posts.disrecommends Disrecommends count of the post
 * @apiSuccess {Number} posts.comment_count Comment count of the post
 * @apiSuccess {String} posts.game_title Game title related the post
 * @apiSuccess {Number} posts.game_id Game ID related the post
 * @apiSuccessExample Success:
 *      HTTP/1.1 200 OK
 *      {
            "posts": [
                {
                    "id": 67,
                    "title": "event test",
                    "views": 3,
                    "created_at": "2019-03-09 09:51:07",
                    "category": "event",
                    "game_title": null,
                    "game_id": null,
                    "recommends": 0,
                    "disrecommends": 0,
                    "comment_count": 0
                }
            ]
        }
 */
router.get('/:user_id/posts', async (req, res, next) => {    
    const { user_id } = req.params;
    const { limit, offset } = req.query;
    const option = [user_id];
    let sql = `
    SELECT
        posts.id, posts.title, views, posts.created_at,
        post_category.value AS category,
        games.title AS game_title, games.id AS game_id,
        (SELECT COUNT(1) FROM post_recommends WHERE post_id = posts.id) as recommends,
        (SELECT COUNT(1) FROM post_disrecommends WHERE post_id = posts.id) as disrecommends,
        (SELECT COUNT(1) FROM post_comments WHERE post_id = posts.id) as comment_count
    FROM
        posts
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
});

/**
 * @api {get} /users/:user-id/posts/comments Get comments user created at posts
 * @apiName GetUserPostComments
 * @apiGroup Users
 * 
 * @apiUse HEADERS_AUTHENTICATION
 * 
 * @apiParam {Object} params
 * @apiParam {Number} params.user-id The ID of the user
 * @apiParam {Object} query
 * @apiUse QUERY_LIMIT
 * @apiUse QUERY_OFFSET
 * 
 * @apiDefine SUCCESS_POST_COMMENTS_SIMPLE
 */
router.get('/:user_id/posts/comments', async (req, res, next) => {
    const { user_id } = req.params;
    const { limit, offset } = req.query;
    const option = [user_id];
    let sql = 'SELECT id, value, post_id FROM post_comments WHERE user_id = ?';

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
});

/**
 * @api {get} /users/:user-id/games/follow Get games user follow
 * @apiName GetGamesUserFollow
 * @apiGroup Users
 * 
 * @apiUse HEADERS_AUTHENTICATION
 * 
 * @apiParam {Object} params
 * @apiParam {Number} params.user-id The ID of the user
 * 
 * @apiSuccess {Json[]} games
 * @apiSuccess {Json} game
 * @apiSuccess {Number} game.id The ID of the game
 * @apiSuccess {String} game.title Title of the game
 * @apiSuccess {String[]} game.images Array of image links
 * @apiSuccessExample Success:
 *      HTTP/1.1 200 OK
 *      {
            "games": [
                {
                    "title": "Super Smash Bros. Melee",
                    "id": 1,
                    "images": [
                        "https://i.kym-cdn.com/entries/icons/original/000/026/290/maxresdefault.jpg"
                    ]
                }
            ]
        }
 */
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

/**
 * @api {get} /users/:user-id/games/score Get game scores user rate
 * @apiName GetGameScoreUserRate
 * @apiGroup Users
 * 
 * @apiDeprecated Considering change structure of API
 * 
 * @apiUse HEADERS_AUTHENTICATION
 * 
 * @apiParam {Object} params
 * @apiParam {Number} params.user-id The ID of the user
 * 
 * @apiSuccess {Json[]} games
 * @apiSuccess {Json} game
 * @apiSuccess {Number} game.id The ID of the game
 * @apiSuccessExample Success:
 *      HTTP/1.1 OK
 *      {
            "games": [
                {
                    "id": 1,
                }
            ]
        }
 */
router.get('/:user_id/games/score', async (req, res, next) => {
    const { user_id } = req.params;
    try {
        const [scores] = await pool.query(`SELECT score, title, id AS game_id, link AS game_image FROM game_score LEFT JOIN games ON games.id = game_score.game_id LEFT JOIN game_images ON game_images.game_id = games.id WHERE user_id = ?`, [user_id]);
        res.status(200).json({ scores });
    } catch (err) {
        next(err);
    }
});

/**
 * @api {get} /users/:user-id/games/comments Get comments user created at games
 * @apiName GetUserGameComments
 * @apiGroup Users
 * 
 * @apiUse HEADERS_AUTHENTICATION
 * 
 * @apiParam {Object} params
 * @apiParam {Number} params.user-id The ID of the user
 * 
 * @apiUse SUCCESS_GAME_COMMENTS_SIMPLE
 */
router.get('/:user_id/games/comments', async (req, res, next) => {
    const { user_id } = req.params;
    try {
        const [comments] = await pool.query(`SELECT id, value, game_id FROM game_comments WHERE user_id = ?`, [user_id]);
        res.status(200).json({ comments });
    } catch (err) {
        next(err);
    }
});

/**
 * @api {get} /users/:user-id/posts/comments/recommends Get post comments user has recommended
 * @apiName GetPostCommentsUserRecommended
 * @apiGroup Users
 * 
 * @apiUse HEADERS_AUTHENTICATION
 * 
 * @apiParam {Object} params
 * @apiParam {Number} params.user-id The ID of the user
 * 
 * @apiUse SUCCESS_POST_COMMENTS_SIMPLE
 */
router.get('/:user_id/posts/comments/recommends', async (req, res, next) => {
    const { user_id } = req.params;
    try {
        const [comments] = await pool.query(`
        SELECT 
            comment_id AS id,
            post_comments.post_id,
            post_comments.value
        FROM post_comment_recommends 
            LEFT JOIN post_comments ON post_comments.id = post_comment_recommends.comment_id
        WHERE post_comment_recommends.user_id = ?`, [user_id]);
        res.status(200).json({ comments }); 
    } catch (err) {
        next(err);
    }
});

/**
 * @api {get} /users/:user-id/posts/comments/disrecommends Get post comments user has disrecommended
 * @apiName GetPostCommentsUserDisrecommended
 * @apiGroup Users
 * 
 * @apiUse HEADERS_AUTHENTICATION
 * 
 * @apiParam {Object} params
 * @apiParam {Number} params.user-id The ID of the user
 * 
 * @apiUse SUCCESS_POST_COMMENTS_SIMPLE
 */
router.get('/:user_id/posts/comments/disrecommends', async (req, res, next) => {
    const { user_id } = req.params;
    try {
        const [comments] = await pool.query(`
        SELECT 
            comment_id AS id,
            post_comments.post_id,
            post_comments.value
        FROM post_comment_disrecommends 
            LEFT JOIN post_comments ON post_comments.id = post_comment_disrecommends.comment_id
        WHERE post_comment_disrecommends.user_id = ?`, [user_id]);
        res.status(200).json({ comments }); 
    } catch (err) {
        next(err);
    }
});

/**
 * @api {get} /users/:user-id/games/comments/recommends Get game comments user has recommended
 * @apiName GetGameCommentsUserRecommended
 * @apiGroup Users
 * 
 * @apiUse HEADERS_AUTHENTICATION
 * 
 * @apiParam {Object} params
 * @apiParam {Number} params.user-id The ID of the user
 * 
 * @apiUse SUCCESS_GAME_COMMENTS_SIMPLE
 */
router.get('/:user_id/games/comments/recommends', async (req, res, next) => {
    const { user_id } = req.params;
    try {
        const [comments] = await pool.query(`
        SELECT 
            comment_id AS id,
            game_comments.game_id,
            game_comments.value
        FROM game_comment_recommends
            LEFT JOIN game_comments ON game_comments.id = game_comment_recommends.comment_id 
        WHERE game_comment_recommends.user_id = ?`, [user_id]);
        res.status(200).json({ comments });
    } catch (err) {
        next(err);
    }
});

/**
 * @api {get} /users/:user-id/games/comments/disrecommends Get game comments user has disrecommended
 * @apiName GetGameCommentsUserDisrecommended
 * @apiGroup Users
 * 
 * @apiUse HEADERS_AUTHENTICATION
 * 
 * @apiParam {Object} params
 * @apiParam {Number} params.user-id The ID of the user
 * 
 * @apiUse SUCCESS_GAME_COMMENTS_SIMPLE
 */
router.get('/:user_id/games/comments/disrecommends', async (req, res, next) => {
    const { user_id } = req.params;
    try {
        const [comments] = await pool.query(`
        SELECT 
            comment_id AS id,
            game_comments.game_id,
            game_comments.value
        FROM game_comment_disrecommends
            LEFT JOIN game_comments ON game_comments.id = game_comment_disrecommends.comment_id 
        WHERE game_comment_disrecommends.user_id = ?`, [user_id]);
        res.status(200).json({ comments });
    } catch (err) {
        next(err);
    }
});

/**
 * @api {get} /users/:user-id/games/features Get game features score user rated
 * @apiName GetUserFeaturesScore
 * @apiGroup Users
 * 
 * @apiUse HEADERS_AUTHENTICATION
 * @apiUse HEADERS_AUTHORIZATION
 * 
 * @apiSuccess {Json[]} games
 * @apiSuccess {Json} game
 * @apiSuccess {Number} game.id The ID of the game
 * @apiSuccess {Json} game.features
 * @apiSuccess {Number} features.게임성 "게임성" score of this game
 * @apiSuccess {Number} features.조작성 "조작성" score of this game
 * @apiSuccess {Number} features.난이도 "난이도" score of this game
 * @apiSuccess {Number} features.스토리 "스토리" score of this game
 * @apiSuccess {Number} features.몰입도 "몰입도" score of this game
 * @apiSuccess {Number} features.BGM "BGM" score of this game
 * @apiSuccess {Number} features.공포성 "공포성" score of this game
 * @apiSuccess {Number} features.과금유도 "과금유도" score of this game
 * @apiSuccess {Number} features.노가다성 "노가다성" score of this game
 * @apiSuccess {Number} features.진입장벽 "진입장벽" score of this game
 * @apiSuccess {Number} features.필요성능 "필요성능" score of this game
 * @apiSuccess {Number} features.플레이타임 "플레이타임" score of this game
 * @apiSuccess {Number} features.가격 "가격" score of this game
 * @apiSuccess {Number} features.DLC "DLC" score of this game
 * @apiSuccess {Number} features.버그 "버그" score of this game
 * @apiSuccess {Number} features.그래픽 "그래픽" score of this game
 * @apiSuccessExample Success:
 *      HTTP/1.1 200 OK
 *      {
            "games": [
                {
                    "id": 1,
                    "features": {
                        "BGM": 3,
                        "DLC": 2,
                        "가격": 5,
                        "버그": 4,
                        "게임성": 1,
                        "공포성": 1,
                        "그래픽": 3,
                        "난이도": 2,
                        "몰입도": 4,
                        "스토리": 2,
                        "조작성": 1,
                        "과금유도": 2,
                        "노가다성": 5,
                        "진입장벽": 1,
                        "필요성능": 3,
                        "플레이타임": 2
                    }
                }
            ]
        }
 */
router.get('/:user_id/games/features', async (req, res, next) => {
    try {
        const user_id = await cert(req);
        if (user_id !== Number(req.params.user_id))
            throw { status: 401, code: "AUTHORIZATION_FAILED", message: "Authorization token and user id do not match"}
        const [games] = await pool.query(`
        SELECT 
            game_id AS id,
            JSON_OBJECT(
                '게임성', 게임성,
                '조작성', 조작성,
                '난이도', 난이도,
                '스토리', 스토리,
                '몰입도', 몰입도,
                'BGM', BGM,
                '공포성', 공포성,
                '과금유도', 과금유도,
                '노가다성', 노가다성,
                '진입장벽', 진입장벽,
                '필요성능', 필요성능,
                '플레이타임', 플레이타임,
                '가격', 가격,
                'DLC', DLC,
                '버그', 버그,
                '그래픽', 그래픽
            ) AS features
        FROM game_features 
            LEFT JOIN games ON games.id = game_features.game_id
        WHERE user_id = ?`, [user_id]);
        res.status(200).json({ games });
    } catch (err) {
        next(err);
    }
});

module.exports = router;