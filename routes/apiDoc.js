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
 * @apiDefine ERROR_POST_NOT_FOUND
 * @apiError POST_NOT_FOUND The ID of the Post was not found
 * @apiErrorExample Error-response:
 *      HTTP/1.1 404 Not Found
 *      {
 *          "message": "Post not found"
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

