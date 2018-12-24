# gamepicker API

## Open Endpoints

* [Login](documents/auth/login.md) : `POST /auth/login`
* [Register](documents/auth/register.md) : `POST /auth/register`

## Curent User related

* [View info](documents/auth/ShowInfo.md) : `GET /auth/me`
* [Update info](documents/auth/UpdateInfo.md) : `PUT /auth/me`
  
## User related

* [View User info](documents/users/read) : `GET /users/:user_id`
* [View user-created posts](documents/users/posts) : `GET /users/:user_id/posts`
* [View user-created comments](documents/users/comments) : `GET /users/:user_id/posts`
* [View user-created reviews](documents/users/review) : `GET /users/:user_id/games/comments`

## Account related

## Game related

* [View all games](documents/games/all) : `GET /games`
* [View game](documents/games/read) : `GET /games/:game_id`
* [Write game](documents/games/create) : `POST /games`
* [Update game](documents/games/update) : `PUT /games/:game_id`
* [Delete game](documents/games/delete) : `DELETE /games/:game_id`
* [Write review](documents/games/reviews/create) : `POST /games/:game_id/comments`
* [View review](documents/games/reviews/read) : `GET /games/:game_id/comments`
* [Update review](documents/games/reviews/update) : `PUT /games/:game_id/comments/:comment_id`
* [Delete review](documents/games/reviews/delete) : `DELETE /games/:game_id/comments/:comment_id`
* [Favorites game](documents/games/favor) : `POST /games/:game_id/favor`

## Post related 

* [View all posts](documents/posts/all) : `GET /posts`
* [View post](documents/posts/read) : `GET /posts/:post_id`
* [Update post](documents/posts/update) : `PUT /posts/:post_id`
* [Delete post](documents/posts/delete) : `DELETE /posts/:post_id`
* [Recommend post](documents/posts/recommend) : `POST /posts/:post_id/recommend`
* [Disrecommend post](documents/posts/disrecommed) : `POST /posts/:post_id/disrecommend`
* [View comments](documents/posts/comments/read) : `GET /posts/:post_id/comments`
* [Write comments](documents/posts/comments/create) : `POST /posts/:post_id/comments`
* [Update comments](documents/posts/comments/update) : `UPDATE /posts/:post_id/comments/:comment_id`
* [Delete comments](documents/posts/comments/delete) : `DELETE /posts/:post_id/comments/:comment_id`
