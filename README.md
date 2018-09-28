# gamepicker API

1. 회원
    - [로그인](#로그인)
    - [회원가입](#회원가입)
    - [회원탈퇴](#회원탈퇴)
    - [개인 프로필 가져오기](#개인-프로필-가져오기)
    - [유저 프로필 가져오기](#유저-프로필-가져오기)
    - [개인 프로필 수정](#개인-프로필-수정)
1. 커뮤니티
    - [글 작성](#글-작성)
    - [인기 글 가져오기](#인기-글-가져오기)
    - [추천 글 가져오기](#추천-글-가져오기)
    - [최신 글 가져오기](#최신-글-가져오기)
    - [글 수정](#글-수정)
    - [글 삭제](#글-삭제)
    - [글 추천](#글-추천)
    - [글 비추천](#글-비추천)
    - [게시판 댓글 달기](#게시판-댓글-달기)
    - [게시판 댓글 가져오기](#게시판-댓글-가져오기)
    - [게시판 댓글 수정](#게시판-댓글-수정)
    - [게시판 댓글 삭제](#게시판-댓글-삭제)
    - [게임 댓글 달기](#게임-댓글-달기)
1. 게임
    - [게임 추가](#게임-추가)
    - [검색어로 게임 가져오기](#검색어로-게임-가져오기)
    - [ID로 게임 가져오기](#ID로-게임-가져오기)
    - [추천 게임 가져오기](#추천-게임-가져오기)
    - [게임 수정](#게임-수정)
    - [게임 삭제](#게임-삭제)
    - [게임 댓글 달기](#게임-댓글-달기)
    - [게임 댓글 가져오기](#게임-댓글-가져오기)
    - [게임 댓글 수정](#게임-댓글-수정)
    - [게임 댓글 삭제](#게임-댓글-삭제)
1. 태그
    - [태그 가져오기](#태그-가져오기)
    - [검색한 태그 가져오기](#검색한-태그-가져오기)
1. 플랫폼
    - [플랫폼 가져오기](#플랫폼-가져오기)

## 회원

### 로그인

```javascript
POST /users/login
```

* Request

```javascript
body {
    email: INPUT_EMAIL,
    password: INPUT_PASSWORD
}
```

* Response

```javascript
SUCCESS { success: true, token: TOKEN }
FAIL    { success: false, message: ERROR_MESSAGE }
```

### 회원가입

```javascript
PUT /users
```

* Request

```javascript
body {
    name: INPUT_NAME,
    email: INPUT_EMAIL,
    password: INPUT_PASSWORD
}
```

* Response

```javascript
SUCCESS { success: true }
FAIL    { success: false, message: ERROR_MESSAGE }
```

### 회원탈퇴

```javascript
DELETE /users
```

* Request

```javascript
header {
    x-access-token: TOKEN
}
```

* Response

```javascript
SUCCESS { success: true }
FAIL    { success: false, message: ERROR_MESSAGE }
```

### 개인 프로필 가져오기

```javascript
GET /users/profile
```

* Request

```javascript
header {
    x-access-token: TOKEN
}
```

* Response

```javascript
SUCCESS { success: true, profile: JSON }
FAIL    { success: false, message: ERROR_MESSAGE }
```

### 유저 프로필 가져오기

```javascript
GET /users/profile/:user_id
```

* Request

```javascript
params {
    user_id: USER_ID
}
```

* Response

```javascript
SUCCESS { success: true, profile: JSON }
FAIL    { success: false, message: ERROR_MESSAGE }
```

### 개인 프로필 수정

```javascript
POST /users/profile
```

* Request

```javascript
header {
    x-access-token: TOKEN
}
```

* Response

```javascript
SUCCESS { success: true }
FAIL    { success: false, message: ERROR_MESSAGE }
```

## 커뮤니티

### 글작성

```javascript
PUT /talks
```

* Request

```javascript
header {
    x-access-token: TOKEN
}
body {
    title: TITLE,
    content: CONTENT,
    game_id: GAME_ID    (optional)
}
```

* Response

```javascript
SUCCESS { success: true }
FAIL    { success: false, message: ERROR_MESSAGE }
```

### 인기 글 가져오기

```javascript
GET /talks/popular
```

* Request

```javascript
query {
    posts: number of posts to show on one page, (optional, default = 10)
    pages: posts of the nth page,               (optional, default = 1)
    game_id: game id of posts                   (optional, default = ALL)
}
```

* Response

```javascript
SUCCESS { success: true , posts: JSON }
FAIL    { success: false, message: ERROR_MESSAGE }
```

### 추천 글 가져오기

```javascript
GET /talks/recommend
```

* Request

```javascript
query {
    posts: number of posts to show on one page, (optional, default = 10)
    pages: posts of the nth page,               (optional, default = 1)
    game_id: game id of posts                   (optional, default = ALL)
}
```

* Response

```javascript
SUCCESS { success: true , posts: JSON }
FAIL    { success: false, message: ERROR_MESSAGE }
```

### 최신 글 가져오기

```javascript
GET /talks/recent
```

* Request

```javascript
query {
    posts: number of posts to show on one page, (optional, default = 10)
    pages: posts of the nth page,               (optional, default = 1)
    game_id: game id of posts                   (optional, default = ALL)
}
```

* Response

```javascript
SUCCESS { success: true , posts: JSON }
FAIL    { success: false, message: ERROR_MESSAGE }
```

### 게시물 수정

```javascript
POST /talks
```

* Request

```javascript
header {
    x-access-token: TOKEN
}
body {
    id: POST_ID,
    title: FIXED_TITLE,
    content: FIXED_CONTENT
}
```

* Response

```javascript
SUCCESS { success: true }
FAIL    { success: false, message: ERROR_MESSAGE }
```

### 게시물 삭제

```javascript
DELETE /talks
```

* Request

```javascript
header {
    x-access-token: TOKEN
}
body {
    id: POST_ID
}
```

* Response

```javascript
SUCCESS { success: true }
FAIL    { success: false, message: ERROR_MESSAGE }
```

### 게시물 추천

```javascript
POST /talks/recommend
```

* Request

```javascript
header {
    x-access-token: TOKEN
}
body {
    id: POST_ID
}
```

* Response

```javascript
SUCCESS { success: true }
FAIL    { success: false, message: ERROR_MESSAGE }
```

### 게시물 비추천

```javascript
POST /talks/disrecommend
```

* Request

```javascript
header {
    x-access-token: TOKEN
}
body {
    id: POST_ID
}
```

* Response

```javascript
SUCCESS { success: true }
FAIL    { success: false, message: ERROR_MESSAGE }
```

### 게시물 댓글 달기

```javascript
PUT /talks/comments
```

* Request

```javascript
header {
    x-access-token: TOKEN
}
body {
    title: TITLE,
    content: CONTENT
}
```

* Response

```javascript
SUCCESS { success: true }
FAIL    { success: false, message: ERROR_MESSAGE }
```

### 게시물 댓글 가져오기

```javascript
GET /talks/comments
```

* Request

```javascript
body {
    post_id: POST_ID
}
```

* Response

```javascript
SUCCESS { success: true, comments: JSON }
FAIL    { success: false, message: ERROR_MESSAGE }
```

### 게시물 댓글 수정하기

```javascript
POST /talks/comments
```

* Request

```javascript
header {
    x-access-token: TOKEN
}
body {
    comment_id: COMMENT_ID,
    title: FIXED TITLE,
    content: FIXED CONTENT
}
```

* Response

```javascript
SUCCESS { success: true }
FAIL    { success: false, message: ERROR_MESSAGE }
```

### 게시물 댓글 삭제하기

```javascript
DELETE /talks/comments
```

* Request

```javascript
header {
    x-access-token: TOKEN
}
body {
    comment_id: COMMENT_ID
}
```

* Response

```javascript
SUCCESS { success: true }
FAIL    { success: false, message: ERROR_MESSAGE }
```

## 게임

### 게임 정보 추가

```javascript
PUT /games
```

* Request

```javascript
body {
    title: TITLE,
    developer: DEVELOPER,
    publisher: PUBLISHER,
    age_rate: AGE_RATE,
    summary: SUMMARY,
    img_link: IMG_LINK,
    video_link: VIDEO_LINK
}
```

* Response

```javascript
SUCCESS { success: true }
FAIL    { success: false, message: ERROR_MESSAGE }
```

### 검색어로 게임 찾기

```javascript
GET /games?query=:query&id=:id&min_rate=:rate&max_rate=:rate
```

* Request

```javascript
query {
    query: find a game which contain query in title,        (optional, default = ALL)
    id: find a game which have same id,                     (optional, default = ALL)
    min_rate: find a game which is higher than minimum rate,(optional, default = 0)
    max_rate: find a game which is lower than maximum rate, (optional, default = 5)
}
```

* Response

```javascript
SUCCESS { success: true, games: JSON }
FAIL    { success: false, message: ERROR_MESSAGE }
```

### 추천 게임 가져오기

```javascript
GET /games/recommend
```

* Request

```javascript
header {
    x-access-token: TOKEN
}
```

* Response

```javascript
SUCCESS { success: true, games: JSON }
FAIL    { success: false, message: ERROR_MESSAGE }
```

### 게임 정보 수정

```javascript
POST /games
```

* Request

```javascript
header {
    x-access-token: TOKEN
}
body {
    title: TITLE,
    developer: DEVELOPER,
    publisher: PUBLISHER,
    age_rate: AGE_RATE,
    summary: SUMMARY,
    img_link: IMG_LINK,
    video_link: VIDEO_LINK
}
```

* Response

```javascript
SUCCESS { success: true }
FAIL    { success: false, message: ERROR_MESSAGE }
```

### 게임 정보 삭제

```javascript
DELETE /games
```

* Request

```javascript
header {
    x-access-token: TOKEN
}
```

* Response

```javascript
SUCCESS { success: true }
FAIL    { success: false, message: ERROR_MESSAGE }
```

### 게임 댓글 달기

```javascript
PUT /games/comments
```

* Request

```javascript
header {
    x-access-token: TOKEN
}
body {
    title: TITLE,
    content: CONTENT
}
```

* Response

```javascript
SUCCESS { success: true }
FAIL    { success: false, message: ERROR_MESSAGE }
```

### 게임 댓글 가져오기

```javascript
GET /games/comments
```

* Request

```javascript
body {
    game_id: GAME_ID
}
```

* Response

```javascript
SUCCESS { success: true, comments: JSON }
FAIL    { success: false, message: ERROR_MESSAGE }
```

### 게임 댓글 수정하기

```javascript
POST /games/comments
```

* Request

```javascript
header {
    x-access-token: TOKEN
}
body {
    comment_id: COMMENT_ID,
    title: FIXED TITLE,
    content: FIXED CONTENT
}
```

* Response

```javascript
SUCCESS { success: true }
FAIL    { success: false, message: ERROR_MESSAGE }
```

### 게임 댓글 삭제하기

```javascript
DELETE /games/comments
```

* Request

```javascript
header {
    x-access-token: TOKEN
}
body {
    comment_id: COMMENT_ID
}
```

* Response

```javascript
SUCCESS { success: true }
FAIL    { success: false, message: ERROR_MESSAGE }
```

## 태그

### 태그 가져오기

```javascript
GET /tags?search=:query
```

* Request

```javascript
query {
    search: query for search    (optional, default = ALL)
}
```

* Response

```javascript
SUCCESS { success: true, tags: JSON }
FAIL    { success: false, message: ERROR_MESSAGE }
```

## 플랫폼

### 플랫폼 가져오기

```javascript
GET /platforms?search=:query
```

* Request

```javascript
query {
    search: query for search    (optional, default = ALL)
}
```

* Response

```javascript
SUCCESS { success: true, platforms: JSON }
FAIL    { success: false, message: ERROR_MESSAGE }
```