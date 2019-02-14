# gamepicker API

## Account related

* [Login](documents/auth/login.json) : `POST /auth/login`
* [Register](documents/auth/register.json) : `POST /auth/register`

## User related

* [View all users](documents/users/all.json) : `GET /users`
* [View info](documents/users/read.md) : `GET /users/:user_id`
* [View created posts](documents/users/posts.md) : `GET /users/:user_id/posts`
* [View created comments](documents/users/comments.md) : `GET /users/:user_id/posts`
* [Recommend games](documents/users/recommend.md) : `GET /users/:user_id/recommend`

## Game related

* [View all games](documents/games/all.md) : `GET /games`
* [View game](documents/games/read.md) : `GET /games/:game_id`
* [Write game](documents/games/create.md) : `POST /games`
* [Update game](documents/games/update.md) : `PUT /games/:game_id`
* [Delete game](documents/games/delete.md) : `DELETE /games/:game_id`
* [Favorites game](documents/games/favor/create.md) : `POST /games/:game_id/favor`
* [Check favorite](documents/games/favor/read.md) : `GET /games/:game_id/favor`
* [Delete favorte](documents/games/favor/delete.md) : `DELETE /games/:game_id/favor`
* [Register advertising games](documents/games/advertising.md) : `POST /games/:game_id/advertising`
* [Register affiliate games](documents/games/affiliate.md) : `POST /games/:game_id/affiliate`
* [Rate the game](documents/games/score/create.json) : `PUT /games/:game_id/score`
* [Get the score of the game I rated](documents/games/score/read.json) : `GET /games/:game_id/score`
* [Get the comment of the game I took](documents/games/score/read.json) : `GET /games/:game_id/comment`
* [Comment the game](documents/games/comment/create.json) : `PUT /games/:game_id/comment`

## Post related 

* [View all posts](documents/posts/all.md) : `GET /posts`
* [View post](documents/posts/read.md) : `GET /posts/:post_id`
* [Write post](documents/posts/write.md) : `POST /posts/:postid`
* [Update post](documents/posts/update.md) : `PUT /posts/:post_id`
* [Delete post](documents/posts/delete.md) : `DELETE /posts/:post_id`
* [Recommend post](documents/posts/recommends/create.json) : `POST /posts/:post_id/recommend`
* [Disrecommend post](documents/posts/disrecommends/create.json) : `POST /posts/:post_id/disrecommend`
* [Cancel recommend post](documents/posts/recommends/delete.json) : `DELETE /posts/:post_id/recommend`
* [Cancel disrecommend post](documents/posts/disrecommends/delete.json) : `DELETE /posts/:post_id/disrecommend`
* [Check recommend](documents/posts/recommends/read.json) : `GET /posts/:post_id/recommend`
* [Check disrecommend](documents/posts/disrecommends/read.json) : `GET /posts/:post_id/recommend`
* [View comments](documents/posts/comments/read.md) : `GET /posts/:post_id/comments`
* [Write comments](documents/posts/comments/create.md) : `POST /posts/:post_id/comments`
* [Update comments](documents/posts/comments/update.md) : `UPDATE /posts/:post_id/comments/:comment_id`
* [Delete comments](documents/posts/comments/delete.md) : `DELETE /posts/:post_id/comments/:comment_id`

## Admin related

* [View all questions](documents/admin/questions/read.json) : `GET /admin/questions`
* [Create questions](documents/admin/questions/create.json) : `POST /admin/questions`
* [Reply questions](documents/admin/questions/reply/create.json) : `POST /admin/questions/:question_id/reply`
* [Push notification](documents/admin/push/create.json) : `POST /admin/push`
* [Write notice](documents/admin/notice/create.json) : `POST /admin/notices`
* [Get all notice](documents/admin/notice/read.json) : `GET /admin/notices`
* [Delete notice](documents/admin/notice/delete.json) : `DELETE /admin/notices/:notice_id`

## Me related

* [Get my information](documents/me/read.json) : `GET /me`
* [Update my information](documents/me/update.json) : `PUT /me`
* [Create my profile image](documents/me/profile/create.json) : `POST /me/profile`
* [Delete my profile image](documents/me/profile/delete.json) : `DELETE /me/profile`
* [Reset my password](documents/me/password/update.json) : `PUT /me/password`
* [Push notification agree](documents/me/push/create.json) : `POST /me/push`
* [Push notification disagree](documents/me/push/delete.json) : `DELETE /me/push`