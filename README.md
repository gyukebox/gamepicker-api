# gamepicker API

| METHOD | URL                            | FUCNTION                                                                   |
| ------ | ------------------------------ | -------------------------------------------------------------------------- |
| POST   | /users                         | [회원 가입](https://github.com/ansrl0107/GamePickerAPI/wiki/회원-가입)             |
| POST   | /login                         | [로그인](https://github.com/ansrl0107/GamePickerAPI/wiki/로그인)                 |
| GET    | /users/:id                     | [회원 정보 조회](https://github.com/ansrl0107/GamePickerAPI/wiki/회원-정보-조회)       |
| PUT    | /users/:id                     | [회원 정보 수정](https://github.com/ansrl0107/GamePickerAPI/wiki/회원-정보-수정)       |
| DELETE | /users/:id                     | [회원 정보 삭제](https://github.com/ansrl0107/GamePickerAPI/wiki/회원-정보-삭제)       |
| GET    | /users                         | [모든 회원 조회](https://github.com/ansrl0107/GamePickerAPI/wiki/모든-회원-조회)       |
| GET    | /me                            | [개인 정보 조회](https://github.com/ansrl0107/GamePickerAPI/wiki/개인-정보-조회)       |
| GET    | /posts                         | [모든 게시물 조회](https://github.com/ansrl0107/GamePickerAPI/wiki/모든-게시물-조회)     |
| POST   | /posts                         | [게시물 작성](https://github.com/ansrl0107/GamePickerAPI/wiki/게시물-작성)           |
| GET    | /posts/:id                     | [게시물 조회](https://github.com/ansrl0107/GamePickerAPI/wiki/게시물-조회)           |
| PUT    | /posts/:id                     | [게시물 수정](https://github.com/ansrl0107/GamePickerAPI/wiki/게시물-수정)           |
| DELETE | /posts/:id                     | [게시물 삭제](https://github.com/ansrl0107/GamePickerAPI/wiki/게시물-삭제)           |
| GET    | /posts/:id/comments            | [게시물 댓글 조회](https://github.com/ansrl0107/GamePickerAPI/wiki/게시물-댓글-조회)     |
| POST   | /posts/:id/comments            | [게시물 댓글 작성](https://github.com/ansrl0107/GamePickerAPI/wiki/게시물-댓글-작성)     |
| PUT    | /posts/:id/comments/:commentID | [게시물 댓글 수정](https://github.com/ansrl0107/GamePickerAPI/wiki/게시물-댓글-수정)     |
| DELETE | /posts/:id/comments/:commentID | [게시물 댓글 삭제](https://github.com/ansrl0107/GamePickerAPI/wiki/게시물-댓글-삭제)     |
| GET    | /games                         | [모든 게임 정보 조회](https://github.com/ansrl0107/GamePickerAPI/wiki/모든-게임-정보-조회) |
| POST   | /games                         | [게임 정보 작성](https://github.com/ansrl0107/GamePickerAPI/wiki/게임-정보-작성)       |
| GET    | /games/:id                     | [게임 정보 조회](https://github.com/ansrl0107/GamePickerAPI/wiki/게임-정보-조회)       |
| PUT    | /games/:id                     | [게임 정보 수정](https://github.com/ansrl0107/GamePickerAPI/wiki/게임-정보-수정)       |
| DELETE | /games/:id                     | [게임 정보 삭제](https://github.com/ansrl0107/GamePickerAPI/wiki/게임-정보-삭제)       |
| POST   | /games/:id/comments            | [게임 댓글 작성](https://github.com/ansrl0107/GamePickerAPI/wiki/게임-댓글-작성)       |
| GET    | /games/:id/comments            | [게임 댓글 조회](https://github.com/ansrl0107/GamePickerAPI/wiki/게임-댓글-조회)       |
| PUT    | /games/:id/comments/:commentID | [게임 댓글 수정](https://github.com/ansrl0107/GamePickerAPI/wiki/게임-댓글-수정)       |
| DELETE | /games/:id/comments/:commentID | [게임 댓글 삭제](https://github.com/ansrl0107/GamePickerAPI/wiki/게임-댓글-삭제)       |
| POST   | /games/:id/rates               | [게임 평가](https://github.com/ansrl0107/GamePickerAPI/wiki/게임-평가)             |
| GET    | /games/:id/rates/:userID       | [게임 평가 점수 조회](https://github.com/ansrl0107/GamePickerAPI/wiki/게임-평가-점수-조회) |
| GET    | /tags                          | [태그 조회](https://github.com/ansrl0107/GamePickerAPI/wiki/태그-조회)             |
| GET    | /platforms                     | [플랫폼 조회](https://github.com/ansrl0107/GamePickerAPI/wiki/플랫폼-조회)           |