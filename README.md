# gamepicker API

## Account related

* [Login](documents/auth/login.md) : `POST /auth/login`
* [Register](documents/auth/register.md) : `POST /auth/register`

## User related

* [View info](documents/users/read.md) : `GET /users/:user_id`
* [Update info](documents/users/update.md) : `PUT /users/:user_id`
* [View created posts](documents/users/posts.md) : `GET /users/:user_id/posts`
* [View created comments](documents/users/comments.md) : `GET /users/:user_id/posts`
* [View created reviews](documents/users/reviews.md) : `GET /users/:user_id/reviews`
* [Register profile photo](documents/users/profile/create.md) : `POST /users/:user_id/profile`
* [Delete profile photo](documents/users/profile/delete.md) : `DELETE /users/:user_id/profile`
* [Recommend games](documents/users/recommend.md) : `GET /users/:user_id/recommend`

## Game related

* [View all games](documents/games/all.md) : `GET /games`
* [View game](documents/games/read.md) : `GET /games/:game_id`
* [Write game](documents/games/create.md) : `POST /games`
* [Update game](documents/games/update.md) : `PUT /games/:game_id`
* [Delete game](documents/games/delete.md) : `DELETE /games/:game_id`
* [Write review](documents/games/reviews/create.md) : `POST /games/:game_id/reviews`
* [View review](documents/games/reviews/read.md) : `GET /games/:game_id/reviews`
* [Update review](documents/games/reviews/update.md) : `PUT /games/:game_id/reviews/:review_id`
* [Delete review](documents/games/reviews/delete.md) : `DELETE /games/:game_id/reviews/:review_id`
* [Favorites game](documents/games/favor/create.md) : `POST /games/:game_id/favor`
* [Check favorite](documents/games/favor/read.md) : `GET /games/:game_id/favor`
* [Delete favorte](documents/games/favor/delete.md) : `DELETE /games/:game_id/favor`
* [Register advertising games](documents/games/advertising.md) : `POST /games/:game_id/advertising`
* [Register affiliate games](documents/games/affiliate.md) : `POST /games/:game_id/affiliate`

## Post related 

* [View all posts](documents/posts/all.md) : `GET /posts`
* [View post](documents/posts/read.md) : `GET /posts/:post_id`
* [Write post](documents/posts/write.md) : `POST /posts/:postid`
* [Update post](documents/posts/update.md) : `PUT /posts/:post_id`
* [Delete post](documents/posts/delete.md) : `DELETE /posts/:post_id`
* [Recommend post](documents/posts/recommend.md) : `POST /posts/:post_id/recommend`
* [Disrecommend post](documents/posts/disrecommed.md) : `POST /posts/:post_id/disrecommend`
* [View comments](documents/posts/comments/read.md) : `GET /posts/:post_id/comments`
* [Write comments](documents/posts/comments/create.md) : `POST /posts/:post_id/comments`
* [Update comments](documents/posts/comments/update.md) : `UPDATE /posts/:post_id/comments/:comment_id`
* [Delete comments](documents/posts/comments/delete.md) : `DELETE /posts/:post_id/comments/:comment_id`

## Admin related

* [View all questions](documents/admin/questions/read.md) : `GET /admin/questions`
* [Create questions](documents/admin/questions/create.md) : `POST /admin/questions`
* [Reply questions](documents/admin/questions/reply.md) : `POST /admin/questions/:question_id/reply`
* [Push notification(Not implemented)](documents/admin/push/create.md) : `POST /admin/push`
* [Write notice](documents/admin/notice/create.md) : `POST /admin/notices`
* [Get all notice](documents/admin/notice/read.md) : `GET /admin/notices`
* [Delete notice](documents/admin/notice/delete.md) : `DELETE /admin/notices/:notice_id`