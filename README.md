# gamepicker API

| METHOD | URL                                           | FUNCTION         |
| ------ | --------------------------------------------- | ---------------- |
| POST   | /auth/login                                   | 로그인              |
| POST   | /auth/register                                | 회원가입             |
| GET    | /auth/activate                                | 메일 인증            |
| PUT    | /auth/me                                      | 본인 정보 수정         |
| PUT    | /auth/me                                      | 회원 탈퇴            |
| GET    | /users/:name                                  | 유저 정보 조회         |
| GET    | /users/:name/posts                            | 유저가 작성한 글 조회     |
| GET    | /users/:name/posts/comments                   | 유저가 작성한 댓글 조회    |
| GET    | /users/:name/games/comments                   | 유저가 작성한 게임 댓글 조회 |
| GET    | /posts                                        | 모든 게시물 조회        |
| GET    | /posts/:id                                    | 게시물 조회           |
| POST   | /posts                                        | 게시물 작성           |
| PUT    | /posts/:id                                    | 게시물 수정           |
| DELETE | /posts/:id                                    | 게시물 삭제           |
| POST   | /posts/:id/recommend                          | 게시물 추천           |
| POST   | /posts/:id/disrecommend                       | 게시물 비추천          |
| GET    | /posts/:post_id/comments                      | 게시물 댓글 조회        |
| POST   | /posts/:post_id/comments                      | 게시물 댓글 작성        |
| PUT    | /posts/:post_id/comments/:comment_id          | 게시물 댓글 수정        |
| DELETE | /posts/:post_id/comments/:comment_id          | 게시물 댓글 삭제        |
