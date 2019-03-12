/**
 * @apiDefine HEADERS_AUTHORIZATION
 * @apiHeader {String} Authorization Authorization token
 */

/**
 * @apiDefone HEADERS_X-ACCESS-TOKEN
 * @apiHeader {String} x-access-token 
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
 * @apiDefine ERROR_POST_NOT_FOUND
 * @apiError POST_NOT_FOUND The ID of the Post was not found
 * @apiErrorExample Error-response:
 *      HTTP/1.1 404 Not Found
 *      {
 *          "message": "Post not found"
 *      }
 */