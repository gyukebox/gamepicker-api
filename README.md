# gamepicker API

가독성을 위해 [WIKI](https://github.com/ansrl0107/GamePickerAPI/wiki/홈) 로 API 명세서를 옮겻습니다.

* Response

| METHOD | URL                            | FUCNTION    |
| ------ | ------------------------------ | ----------- |
| GET    | /me                            | 개인 정보 조회    |
| POST   | /login                         | 로그인         |
| POST   | /games                         | 게임 정보 작성    |
| GET    | /games                         | 게임 정보 조회    |
| PUT    | /games/:id                     | 게임 정보 수정    |
| DELETE | /games/:id                     | 게임 정보 삭제    |
| POST   | /games/:id/comments            | 게임 댓글 작성    |
| GET    | /games/:id/comments            | 게임 댓글 조회    |
| PUT    | /games/:id/comments/:commentID | 미구현         |
| DELETE | /games/:id/comments/:commentID | 미구현         |
| POST   | /games/:id/rates               | 게임 평가하기     |
| GET    | /games/:id/rates/:userID       | 게임 평가 점수 조회 |
| GET    | /users                         | 모든 회원 조회    |
| POST   | /users                         | 회원 가입       |
| GET    | /users/:id                     | 회원 정보 조회    |
| PUT    | /users/:id                     | 회원 정보 수정    |
| DELETE | /users/:id                     | 회원 정보 삭제    |
| GET    | /posts                         | 모든 게시물 조회   |
| POST   | /posts                         | 게시물 작성      |
| GET    | /posts/:id                     | 게시물 조회      |
| PUT    | /posts/:id                     | 게시물 수정      |
| DELETE | /posts/:id                     | 게시물 삭제      |
| POST   | /posts/:id/comments            | 게시물 댓글 작성   |
| PUT    | /posts/:id/comments/:commentID | 미구현         |
| DELETE | /posts/:id/comments/:commentID | 미구현         |