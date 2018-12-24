# gamepicker API

| METHOD | URL                                  | FUNCTION                                                   |
| ------ | ------------------------------------ | ---------------------------------------------------------- |
| POST   | /auth/login                          | [로그인](https://github.com/ansrl0107/GamePickerAPI/wiki/로그인) |
| POST   | /auth/register                       | [회원가입](https://github.com/ansrl0107/GamePickerAPI/wiki/회원가입)                                                       |
| GET    | /auth/activate                       | [메일인증](https://github.com/ansrl0107/GamePickerAPI/wiki/메일인증)                                                      |
| PUT    | /auth/me                             | [본인정보 수정](https://github.com/ansrl0107/GamePickerAPI/wiki/본인정보-수정)                                               |
| DELETE | /auth/me                             | [회원탈퇴](https://github.com/ansrl0107/GamePickerAPI/wiki/회원탈퇴)                                                      |
| GET    | /users/:name                         | [유저정보 조회](https://github.com/ansrl0107/GamePickerAPI/wiki/유저정보-조회)                                                   |
| GET    | /users/:name/posts                   | [유저가 작성한 글 조회](https://github.com/ansrl0107/GamePickerAPI/wiki/유저가-작성한-글-조회)                                               |
| GET    | /users/:name/posts/comments          | [유저가 작성한 댓글 조회](https://github.com/ansrl0107/GamePickerAPI/wiki/유저가-작성한-게임-댓글-조회)                                              |
| GET    | /users/:name/games/comments          | [유저가 작성한 게임리뷰 조회](https://github.com/ansrl0107/GamePickerAPI/wiki/유저가-작성한-게임리뷰-조회)                                           |
| GET    | /posts                               | [모든 게시물 조회](https://github.com/ansrl0107/GamePickerAPI/wiki/모든-게시물-조회)                                                  |
| GET    | /posts/:id                           | [게시물 조회](https://github.com/ansrl0107/GamePickerAPI/wiki/게시물-조회)                                                     |
| POST   | /posts                               | [게시물 작성](https://github.com/ansrl0107/GamePickerAPI/wiki/게시물-작성)                                                     |
| PUT    | /posts/:id                           | [게시물 수정](https://github.com/ansrl0107/GamePickerAPI/wiki/게시물-수정)                                                     |
| DELETE | /posts/:id                           | [게시물 삭제](https://github.com/ansrl0107/GamePickerAPI/wiki/게시물-삭제)                                                     |
| POST   | /posts/:id/recommend                 | [게시물 추천](https://github.com/ansrl0107/GamePickerAPI/wiki/게시물-추천)                                                     |
| POST   | /posts/:id/disrecommend              | [게시물 비추천](https://github.com/ansrl0107/GamePickerAPI/wiki/게시물-비추천)                                                    |
| GET    | /posts/:post_id/comments             | [게시물 댓글 조회](https://github.com/ansrl0107/GamePickerAPI/wiki/게시물-댓글-조회)                                                  |
| POST   | /posts/:post_id/comments             | [게시물 댓글 작성](https://github.com/ansrl0107/GamePickerAPI/wiki/게시물-댓글-작성)                                                  |
| PUT    | /posts/:post_id/comments/:comment_id | [게시물 댓글 수정](https://github.com/ansrl0107/GamePickerAPI/wiki/게시물-댓글-수정)                                                  |
| DELETE | /posts/:post_id/comments/:comment_id | [게시물 댓글 삭제](https://github.com/ansrl0107/GamePickerAPI/wiki/게시물-댓글-삭제)                                                  |
| GET    | /games                               | [모든 게임 조회](https://github.com/ansrl0107/GamePickerAPI/wiki/모든-게임-조회)                                                   |
| GET    | /games/:id                           | [게임 조회](https://github.com/ansrl0107/GamePickerAPI/wiki/게임-조회)                                                      |
| POST   | /games/:id                           | 게임 추가 ?                                                    |
| PUT    | /games/:id                           | 게임 수정 ?                                                    |
| DELETE | /games/:id                           | [게임 삭제](https://github.com/ansrl0107/GamePickerAPI/wiki/게임-삭제)                                                      |
| GET    | /games/:id/comments                  | [게임 리뷰 조회](https://github.com/ansrl0107/GamePickerAPI/wiki/게임-리뷰-조회)                                                   |
| POST   | /games/:id/comments                  | [게임 리뷰 작성](https://github.com/ansrl0107/GamePickerAPI/wiki/게임-리뷰-작성)                                                   |
| PUT    | /games/:game_id/comments/:comment_id | [게임 리뷰 수정](https://github.com/ansrl0107/GamePickerAPI/wiki/게임-리뷰-수정)                                                   |
| DELETE | /games/:game_id/comments/:comment_id | [게임 리뷰 삭제](https://github.com/ansrl0107/GamePickerAPI/wiki/게임-리뷰-삭제)                                                   |
| POST   | /:game_id/favor                      | [게임 즐겨찾기](https://github.com/ansrl0107/GamePickerAPI/wiki/게임-즐겨찾기)                                                    |