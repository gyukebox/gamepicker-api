const express = require('express');
const router = express.Router();
const cert = require('../controller/certification')();

/**
 * @api {get} /games Get games
 * @apiName GetGames
 * @apiGroup Games
 * 
 * @apiUse HEADERS_AUTHENTICATION
 * @apiUse HEADERS_AUTHORIZATION
 * 
 * @apiParam {Object} query
 * @apiUse QUERY_LIMIT
 * @apiUse QUERY_OFFSET
 * @apiParam {Number} platform_id Returns the game corresponding to the platform_id
 * @apiParam {String} sort Sorting options (random)
 * 
 * @apiSuccess {Json[]} games
 * @apiSuccess {Json} game
 * @apiSuccess {Number} game.id The ID of the game
 * @apiSuccess {String} game.title Title of the game
 * @apiSuccess {String} game.developer Developer of the game
 * @apiSuccess {String} game.publisher Publisher of the game
 * @apiSuccess {DateTime} game.created_at The time the game was added
 * @apiSuccess {String[]} game.images Array of image links
 * @apiSuccess {String[]} game.videos Array of video links
 * @apiSuccess {String[]} game.platforms Array of platforms
 * @apiSuccess {Number} game.score Average score of the game
 * @apiSuccess {Number} game.score_count Number of user rate the game
 * @apiSuccessExample Success:
 *      HTTP/1.1 200 OK
 *      {
            "games": [
                {
                    "id": 1,
                    "title": "Super Smash Bros. Melee",
                    "developer": "HAL Laboratory",
                    "publisher": "Nintendo",
                    "created_at": "2019-03-03 14:01:27",
                    "images": [
                        "https://i.kym-cdn.com/entries/icons/original/000/026/290/maxresdefault.jpg"
                    ],
                    "videos": [],
                    "platforms": [
                        "Nintendo GameCube"
                    ],
                    "score": 3.84,
                    "score_count": 16
                }
            ]
        }
 */
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
            (SELECT JSON_ARRAYAGG(value) FROM game_platforms LEFT JOIN platforms ON platforms.id = game_platforms.platform_id WHERE game_id = games.id) AS platforms,
            (SELECT AVG(score) FROM game_score WHERE game_id = games.id) AS score,
            (SELECT COUNT(score) FROM game_score WHERE game_id = games.id) AS score_count
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
        games.forEach(game => {
            if (!game.images)
                game.images = [];
            if (!game.videos)
                game.videos = [];
        })
        res.status(200).json({ games })
    } catch (err) {
        next(err);
    }
});

/**
 * @api {get} /games/:game-id GetGame
 * @apiName GetGame
 * @apiGroup Games
 * 
 * @apiUse HEADERS_AUTHENTICATION
 * @apiUse HEADERS_AUTHORIZATION
 * 
 * @apiParam {Object} params
 * @apiParam {Number} game-id The ID of the game
 * 
 * @apiSuccess {Json[]} games
 * @apiSuccess {Json} game
 * @apiSuccess {Number} game.id The ID of the game
 * @apiSuccess {String} game.title Title of the game
 * @apiSuccess {String} game.developer Developer of the game
 * @apiSuccess {String} game.publisher Publisher of the game
 * @apiSuccess {String} game.summary Summary of the game
 * @apiSuccess {String} game.age_rate Age rating of the game
 * @apiSuccess {DateTime} game.created_at The time the game was added
 * @apiSuccess {String[]} game.images Array of image links
 * @apiSuccess {String[]} game.videos Array of video links
 * @apiSuccess {String[]} game.platforms Array of platforms
 * @apiSuccess {Number} game.score Average score of the game
 * @apiSuccess {Number} game.score_count Number of user rate the game
 *      HTTP/1.1 200 OK
 *      {
            "game": {
                "id": 1,
                "title": "Super Smash Bros. Melee",
                "developer": "HAL Laboratory",
                "publisher": "Nintendo",
                "created_at": "2019-03-03 14:01:27",
                "summary": "A classic and legendary Nintendo title, this game was the number one seller of all time for the Nintendo GameCube. To this day, this game still maintains a very strong competitive following.",
                "age_rate": "전체이용가",
                "images": [
                    "https://i.kym-cdn.com/entries/icons/original/000/026/290/maxresdefault.jpg"
                ],
                "videos": [],
                "platforms": [
                    "Nintendo GameCube"
                ],
                "score": null,
                "score_count": 0
            }
        }
 *      
 * @apiUse ERROR_GAME_NOT_FOUND
 */
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
            const [[favor]] = await pool.query(`SELECT 1 FROM favor WHERE user_id = ? AND game_id = ?`, [user_id, game_id]);
            const [[row]] = await pool.query(`SELECT score FROM game_score WHERE user_id = ? AND game_id = ?`, [user_id, game_id]);
            game.favor = !!favor;
            game.my_score = row?row.score:null;
        }
        if (!game.images)
            game.images = [];
        if (!game.videos)
            game.videos = [];
        if (!game.platforms)
            game.platforms = [];
        if (!game)
            throw { status: 404, message: 'Game not found' }
        res.status(200).json({ game })
    } catch (err) {
        next(err);
    }
});

/**
 * @api {post} /games Add games
 * @apiName AddGAmes
 * @apiGroup Games
 * 
 * @apiUse HEADERS_AUTHENTICATION
 * @apiUse HEADERS_AUTHORIZATION
 * 
 * @apiParam {Object} body
 * @apiParam {String} body.title Title of the game
 * @apiParam {String} body.developer Developer of the game
 * @apiParam {String} body.publisher Publisher of the game
 * @apiParam {String} body.summary Summary of the game
 * @apiParam {String} body.age_rate Age rate of the game
 * @apiParam {String[]} body.images Array of the game image links
 * @apiParam {String[]} body.videos Array of the game video links
 * @apiParam {String[]} body.platforms Array of the game platforms
 * 
 * @apiUse SUCCESS_EMPTY
 */
router.post('/', async (req, res, next) => {
    const { title, developer, publisher, summary, age_rate } = req.body;
    let { images, videos, platforms } = req.body;
    
    try {
        await cert.admin(req);
        const [{insertId}] = await pool.query(`INSERT INTO games (title, developer, publisher, summary, age_rate) VALUES (?, ?, ?, ?, ?)`,[title, developer, publisher, summary, age_rate]);
        console.log(insertId);
        if (images.length > 0)
            await pool.query(`INSERT INTO game_images (game_id, link) VALUES ${images.map(image => `(${insertId}, ?)`).toString()}`, images);
        if (videos.length > 0)
            await pool.query(`INSERT INTO game_videos (game_id, link) VALUES ${videos.map(video => `(${insertId}, ?)`).toString()}`, videos);
        if (platforms.length > 0)
            await pool.query(`INSERT INTO game_platforms (game_id, platform_id) VALUES ${platforms.map(platform => `(${insertId}, (SELECT id FROM platforms WHERE value = ?))`).toString()}`, platforms);
        res.status(204).json();
    } catch (err) {
        next(err);
    }
});

/**
 * @api {post} /games/:game-id/features Rate game features
 * @apiName RateGameFeatures
 * @apiGroup Games
 * 
 * @apiUse HEADERS_AUTHENTICATION
 * @apiUse HEADERS_AUTHORIZATION
 * 
 * @apiParam {Object} body
 * @apiParam {Number} body.게임성 "게임성" score of this game
 * @apiParam {Number} body.조작성 "조작성" score of this game
 * @apiParam {Number} body.난이도 "난이도" score of this game
 * @apiParam {Number} body.스토리 "스토리" score of this game
 * @apiParam {Number} body.몰입도 "몰입도" score of this game
 * @apiParam {Number} body.BGM "BGM" score of this game
 * @apiParam {Number} body.공포성 "공포성" score of this game
 * @apiParam {Number} body.과금유도 "과금유도" score of this game
 * @apiParam {Number} body.노가다성 "노가다성" score of this game
 * @apiParam {Number} body.진입장벽 "진입장벽" score of this game
 * @apiParam {Number} body.필요성능 "필요성능" score of this game
 * @apiParam {Number} body.플레이타임 "플레이타임" score of this game
 * @apiParam {Number} body.가격 "가격" score of this game
 * @apiParam {Number} body.DLC "DLC" score of this game
 * @apiParam {Number} body.버그 "버그" score of this game
 * @apiParam {Number} body.그래픽 "그래픽" score of this game
 * 
 * @apiUse SUCCESS_EMPTY
 * 
 * @apiUse ERROR_GAME_NOT_FOUND
 */
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

/**
 * @api {put} /games/:game-id Update game information
 * @apiName Update game information
 * @apiGroup Games
 * 
 * @apiUse HEADERS_AUTHORIZATION
 * @apiUse HEADERS_AUTHENTICATION
 * 
 * @apiParam {Object} params
 * @apiParam {Number} params.game-id The ID of the game
 * @apiParam {Object} body
 * @apiParam {String} body.title Title of the game
 * @apiParam {String} body.developer Developer of the game
 * @apiParam {String} body.publisher Publisher of the game
 * @apiParam {String} body.summary Summary of the game
 * @apiParam {String} body.age_rate Age rate of the game
 * @apiParam {String[]} body.images Array of the game image links
 * @apiParam {String[]} body.videos Array of the game video links
 * @apiParam {String[]} body.platforms Array of the game platforms
 * 
 */
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

        if (images.length > 0)
            await pool.query(`INSERT INTO game_images (game_id, link) VALUES ${images.map(image => `(${game_id}, ?)`).toString()}`, images);
        if (videos.length > 0)
            await pool.query(`INSERT INTO game_videos (game_id, link) VALUES ${videos.map(video => `(${game_id}, ?)`).toString()}`, videos);
        if (platforms.length > 0)
            await pool.query(`INSERT INTO game_platforms (game_id, platform_id) VALUES ${platforms.map(platform => `(${game_id}, (SELECT id FROM platforms WHERE value = ?))`).toString()}`, platforms);

        await pool.query(`COMMIT`);
        res.status(204).json();
    } catch (err) {
        await pool.query(`ROLLBACK`)
        next(err);
    }
});

/**
 * @api {delete} /games/:game-id Delete game information
 * @apiName DeleteGame
 * @apiGroup Games
 * 
 * @apiUse HEADERS_AUTHENTICATION
 * @apiUse HEADERS_AUTHORIZATION
 * 
 * @apiParam {Object} params
 * @apiParam {Number} params.game-id The ID of the game
 * 
 * @apiUse SUCCESS_EMPTY
 */
router.delete('/:game_id', async (req, res, next) => {
    const { game_id } = req.params;
    try {
        await cert.admin(req);
        await pool.query(`DELETE FROM games WHERE id = ?`, [game_id]);
        res.status(204).json();
    } catch (err) {
        next(err);
    }
});

/**
 * @api {post} /games/:game-id/follow Follow games
 * @apiName FollowGames
 * @apiGroup Games
 * 
 * @apiUse HEADERS_AUTHENTICATION
 * @apiUse HEADERS_AUTHORIZATION
 * 
 * @apiParam {Object} params
 * @apiParam {Number} params.game-id The ID of the game
 * 
 * @apiUse SUCCESS_EMPTY
 * 
 * @apiUse ERROR_GAME_NOT_FOUND
 * @apiError GAME_DUPLICATE Already follow this game
 * @apiErrorExample GAME_DUPLICATE:
 *      HTTP/1.1 409 Conflict
 *      {
 *          code: "GAME_DUPLICATE",
 *          "message": "Already follow this game"
 *      }
 */
router.post('/:game_id/follow', async (req, res, next) => {
    const { game_id } = req.params;
    try {
        const user_id = await cert.user(req);
        await pool.query(`INSERT INTO favor (user_id, game_id) VALUES (?, ?)`, [user_id, game_id]);
        res.status(204).json();
    } catch (err) {
        if (err.errno === 1062) {
            next({status: 409, code:"GAME_DUPLICATE", message: "Already follow this game"});
        } else if (err.errno === 1452) {
            next({status: 404, code: "GAME_NOT_FOUND", message: "Game not found"});
        } else {
            next(err);
        }
    }
});

/**
 * @api {delete} /games/:game-id/follow Cancle follow games
 * @apiName CancleFollowGames
 * @apiGroup Games
 * 
 * @apiUse HEADERS_AUTHENTICATION
 * @apiUse HEADERS_AUTHORIZATION
 * 
 * @apiParam {Object} params
 * @apiParam {Number} params.game-id The ID of the game
 * 
 * @apiUse SUCCESS_EMPTY
 */
router.delete('/:game_id/follow', async (req, res, next) => {
    const { game_id } = req.params;
    try {
        const user_id = await cert.user(req);
        await pool.query(`DELETE FROM favor WHERE user_id = ? AND game_id = ?`,[user_id, game_id]);
        res.status(204).json();
    } catch (err) {
        next(err);
    }
});

/**
 * @api {put} /games/:game-id/score Rate game score
 * @apiName RateGameScore
 * @apiGroup Games
 * 
 * @apiUse HEADERS_AUTHENTICATION
 * @apiUse HEADERS_AUTHORIZATION
 * 
 * @apiParam {Object} params
 * @apiParam {Number} params.game-id The ID of the game
 * @apiParam {Obeject} body
 * @apiParam {Number} body.score Score of the game
 * 
 * @apiUse SUCCESS_EMPTY
 * 
 * @apiUse ERROR_GAME_NOT_FOUND
 */
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
        if (err.errno === 1452) {
            next({ status: 404, code: "GAME_NOT_FOUND", message: 'Game not found' });
        } else {
            next(err);
        }
    }
});

/**
 * @api {post} /games/:game-id/comments Add game comments
 * @apiName AddGameComments
 * @apiGroup Games
 * 
 * @apiUse HEADERS_AUTHENTICATION
 * @apiUse HEADERS_AUTHORIZATION
 * 
 * @apiParam {Object} params
 * @apiParam {Number} params.game-id The ID of the game
 * @apiParam {Obeject} body
 * @apiParam {Number} body.value Content of game comment
 * 
 * @apiUse SUCCESS_EMPTY
 * 
 * @apiUse ERROR_GAME_NOT_FOUND
 */
router.post('/:game_id/comments', async (req, res, next) => {
    const { game_id } = req.params;
    const { value } = req.body;
    try {
        const user_id = await cert.user(req);
        const [rows] = await pool.query(`SELECT 1 FROM game_comments WHERE user_id = ? AND game_id = ?`, [user_id, game_id]);
        if (rows.length > 0) {
            await pool.query(`UPDATE game_comments SET value = ? WHERE user_id = ? AND game_id = ?`, [value, user_id, game_id]);
        } else {
            await pool.query(`INSERT INTO game_comments (user_id, game_id, value) VALUES (?, ?, ?)`, [user_id, game_id, value]);
        } 
        res.status(204).json();
    } catch (err) {
        if (err.errno === 1452) {
            next({ status: 404, code: "GAME_NOT_FOUND", message: 'Game not found' });
        } else {
            next(err);
        }
    }
});

/**
 * @api {GET} /games/:game-id/comments GET game comments
 * @apiName GeeGameComments
 * @apiGroup Games
 * 
 * @apiUse HEADERS_AUTHENTICATION
 * @apiUse HEADERS_AUTHORIZATION
 * 
 * @apiParam {Object} params
 * @apiParam {Number} params.game-id The ID of the game
 * 
 * @apiSuccess {Json[]} comments
 * @apiSuccess {Json} comment
 * @apiSuccess {Number} comment.id The ID of the comment
 * @apiSuccess {String} comment.value Content of the comments
 * @apiSuccess {Number} comment.user_id The ID of the user
 * @apiSuccess {String} comment.user_name Name of the user
 * @apiSuccess {DateTime} comment.created_at The time the comment was added
 * @apiSuccess {Number} comment.recommends Number of comment recommends
 * @apiSuccess {Number} comment.disrecommends Number of comment disrecommends
 * @apiSuccessExample Success:
 *      HTTP/1.1 200 OK
 *      {
            "comments": [
                {
                    "id": 97,
                    "value": "ㅋㅋㅋㅋㅋㅋㅋㅋ",
                    "created_at": "2019-03-11 03:12:03",
                    "user_id": 12,
                    "user_name": "개발담당",
                    "recommends": 0,
                    "disrecommends": 0,
                }
            ]
        }
 * 
 * @apiUse ERROR_GAME_NOT_FOUND
 */
router.get(`/:game_id/comments`, async (req, res, next) => {
    const { game_id } = req.params;
    try {
        const [comments] = await pool.query(`SELECT 
            value, game_comments.user_id, name AS user_name, created_at, game_comments.updated_at,
            COUNT(game_comment_recommends.user_id) AS recommends,
            COUNT(game_comment_disrecommends.user_id) AS disrecommends
        FROM game_comments 
            LEFT JOIN users ON users.id = game_comments.user_id 
            LEFT JOIN game_comment_recommends ON game_comment_recommends.comment_id = game_comments.id
            LEFT JOIN game_comment_disrecommends ON game_comment_disrecommends.comment_id = game_comments.id
        WHERE game_id = ?
        GROUP BY game_comments.id`, [game_id]);
        res.status(200).json({comments});
    } catch (err) {
        next(err);
    }
});

/**
 * @api {delete} /games/:game-id/comments/:comment-id Delete game comment
 * @apiName DeleteGameComment
 * @apiGroup Games
 * 
 * @apiUse HEADERS_AUTHORIZATION
 * @apiUse HEADERS_AUTHENTICATION
 * 
 * @apiParam {Object} params
 * @apiParam {Number} params.game-id The ID of the game
 * @apiParam {Number} params.comment-id The ID of the comment
 * 
 * @apiUse SUCCESS_EMPTY
 */
router.delete(`/:game_id/comments/:comment_id`, async (req, res, next) => {
    const { game_id, comment_id } = req.params;
    try {
        await pool.query(`DELETE FROM game_comments WHERE game_id = ? AND id = ?`, [game_id, comment_id]);
        res.status(204).json();
    } catch (err) {
        next(err);
    }
});

/**
 * @api {post} /games/:game-id/comments/:comment-id/recommends Recommends the game comment
 * @apiName RecommendGameComment
 * @apiGroup Games
 * 
 * @apiUse HEADERS_AUTHORIZATION
 * @apiUse HEADERS_AUTHENTICATION
 * 
 * @apiParam {Object} params
 * @apiParam {Number} params.game-id The ID of the game
 * @apiParam {Number} params.comment-id The ID of the comment
 * 
 * @apiUse SUCCESS_EMPTY
 * 
 * @apiUse ERROR_COMMENT_NOT_FOUND
 * @apiError COMMENT_DUPLICATE Already recommended this comment
 * @apiErrorExample COMMENT_DUPLICATE:
 *      HTTP/1.1 409 Conflict
 *      {
 *          code: "COMMENT_DUPLICATE",
 *          "message": "Already recommended this comment"
 *      }
 */
router.post('/:game_id/comments/:comment_id/recommends', async (req, res, next) => {
    const { game_id, comment_id } = req.params;
    try {
        const user_id = await cert.user(req);
        await pool.query(`INSERT INTO game_comment_recommends (user_id, comment_id) VALUES (?, ?)`, [user_id, comment_id]);
        res.status(204).json();
    } catch (err) {
        if (err.errno === 1452) {
            next({status: 404, message: "Comment not found"});
        } else if (err.errno === 1062) {
            next({status: 409, message: "Already recommended this comment"});
        } else {
            next(err);
        }
    }
});

/**
 * @api {post} /games/:game-id/comments/:comment-id/recommends Cancle recommends the game comment
 * @apiName CancleRecommendGameComment
 * @apiGroup Games
 * 
 * @apiUse HEADERS_AUTHORIZATION
 * @apiUse HEADERS_AUTHENTICATION
 * 
 * @apiParam {Object} params
 * @apiParam {Number} params.game-id The ID of the game
 * @apiParam {Number} params.comment-id The ID of the comment
 * 
 * @apiUse SUCCESS_EMPTY
 * 
 */
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

/**
 * @api {post} /games/:game-id/comments/:comment-id/disrecommends Disrecommends the game comment
 * @apiName DisrecommendGameComment
 * @apiGroup Games
 * 
 * @apiUse HEADERS_AUTHORIZATION
 * @apiUse HEADERS_AUTHENTICATION
 * 
 * @apiParam {Object} params
 * @apiParam {Number} params.game-id The ID of the game
 * @apiParam {Number} params.comment-id The ID of the comment
 * 
 * @apiUse SUCCESS_EMPTY
 * 
 * @apiUse ERROR_COMMENT_NOT_FOUND
 * @apiError COMMENT_DUPLICATE Already disrecommended this comment
 * @apiErrorExample COMMENT_DUPLICATE:
 *      HTTP/1.1 409 Conflict
 *      {
 *          code: "COMMENT_DUPLICATE",
 *          "message": "Already disrecommended this comment"
 *      }
 */
router.post('/:game_id/comments/:comment_id/disrecommends', async (req, res, next) => {
    const { game_id, comment_id } = req.params;
    try {
        const user_id = await cert.user(req);
        await pool.query(`INSERT INTO game_comment_disrecommends (user_id, comment_id) VALUES (?, ?)`, [user_id, comment_id]);
        res.status(204).json();
    } catch (err) {
        if (err.errno === 1452) {
            next({status: 404, message: "Comment not found"});
        } else if (err.errno === 1062) {
            next({status: 409, message: "Already recommended this comment"});
        } else {
            next(err);
        }
    }
});

/**
 * @api {post} /games/:game-id/comments/:comment-id/disrecommends Cancle disrecommends the game comment
 * @apiName CancleDisrecommendGameComment
 * @apiGroup Games
 * 
 * @apiUse HEADERS_AUTHORIZATION
 * @apiUse HEADERS_AUTHENTICATION
 * 
 * @apiParam {Object} params
 * @apiParam {Number} params.game-id The ID of the game
 * @apiParam {Number} params.comment-id The ID of the comment
 * 
 * @apiUse SUCCESS_EMPTY
 * 
 */
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

/**
 * @api {post} /games/:game-id/favorite Game favorites
 * @apiName GameFavorites
 * @apiGroup Games
 * 
 * @apiUse HEADERS_AUTHORIZATION
 * @apiUse HEADERS_AUTHENTICATION
 * 
 * @apiParam {Object} params
 * @apiParam {Number} params.game-id The ID of the game
 * 
 * @apiUse SUCCESS_EMPTY
 * 
 * @apiError GAME_NOT_FOUND The ID of the Game was not found
 * @apiErrorExample Error-response:
 *      HTTP/1.1 404 Not Found
 *      {
 *          "message": "Game not found"
 *      }
 * @apiError FAVORITES_DUPLICATE You already favorites this game
 * @apiErrorExample Error-response:
 *      HTTP/1.1 404 Not Found
 *      {
 *          "message": "You already favorites this game"
 *      }
 */
router.post('/:game_id/favorites', async (req, res, next) => {
    const { game_id } = req.params;
    try {
        const user_id = await cert.user(req);
        await pool.query(`INSERT INTO game_favorites (game_id, user_id) VALUES (?, ?)`, [game_id, user_id]);
        res.status(204).json();
    } catch (err) {
        if (err.errno == 1452) {
            err = { status: 404, code: "GAME_NOT_FOUND", message: `Game not found` }
        }
        if (err.errno == 1062) {
            err = { status: 409, code: "FAVORITES_DUPLICATE", message: "You already favorites this game"}
        }
        next(err);
    }
});

/**
 * @api {delete} /games/:game-id/favorite Cancel game favorites
 * @apiName CancelGameFavorites
 * @apiGroup Games
 * 
 * @apiUse HEADERS_AUTHORIZATION
 * @apiUse HEADERS_AUTHENTICATION
 * 
 * @apiParam {Object} params
 * @apiParam {Number} params.game-id The ID of the game
 * 
 * @apiUse SUCCESS_EMPTY
 */
router.delete('/:game_id/favorites', async (req, res, next) => {
    const { game_id } = req.params;
    try {
        const user_id = await cert.user(req);
        await pool.query(`DELETE FROM game_favorites WHERE game_id = ? AND user_id = ?)`, [game_id, user_id]);
        res.status(204).json();
    } catch (err) {
        next(err);
    }
});

module.exports = router;