Gamepicker API 명세서
=====================
# 목차
1. 회원
    - [로그인](#로그인)
    - [회원가입](#회원가입)
    - [회원탈퇴](#회원탈퇴)
    - [개인 프로필 가져오기](#개인-프로필-가져오기)
    - [유저 프로필 가져오기](#유저-프로필-가져오기)
    - [개인 프로필 수정](#개인-프로필-수정)
2. 커뮤니티
    - [글 작성](#글-작성)
    - [인기 글 가져오기](#인기-글-가져오기)
    - [추천 글 가져오기](#추천-글-가져오기)
    - [최신 글 가져오기](#최신-글-가져오기)
    - [글 수정](#글-수정)
    - [글 삭제](#글-삭제)
    - [글 추천](#글-추천)
    - [글 비추천](#글-비추천)
3. 게임
    - [게임 추가](#게임-추가)
    - [검색어로 게임 가져오기](#검색어로-게임-가져오기)
    - [ID로 게임 가져오기](#ID로-게임-가져오기)
    - [추천 게임 가져오기](#추천-게임-가져오기)
    - [게임 수정](#게임-수정)
    - [게임 삭제](#게임-삭제)
4. 댓글
    - [게시판 댓글 달기](#게시판-댓글-달기)
    - [게시판 댓글 가져오기](#게시판-댓글-가져오기)
    - [게시판 댓글 수정](#게시판-댓글-수정)
    - [게시판 댓글 삭제](#게시판-댓글-삭제)
    - [게임 댓글 달기](#게임-댓글-달기)
    - [게임 댓글 가져오기](#게임-댓글-가져오기)
    - [게임 댓글 수정](#게임-댓글-수정)
    - [게임 댓글 삭제](#게임-댓글-삭제)
5. 태그
    - [태그 가져오기](#태그-가져오기)
    - [검색한 태그 가져오기](#검색한-태그-가져오기)
6. 플랫폼
    - [플랫폼 가져오기](#플랫폼-가져오기)

# 회원
## 로그인
<pre><code>POST /users/login</code></pre>
* Request
<pre><code>{
    "email": INPUT_EMAIL,
    "password": INPUT_PASSWORD
}</code></pre>
* Response
<pre><code>SUCCESS { "token": USER_TOKEN }
FAIL { "error": ERR_MESSAGE}</code></pre>

## 회원가입
<pre><code>PUT /users</code></pre>
* request
<pre><code>{
    "name": INPUT_NAME,
    "email": INPUT_EMAIL,
    "password": INPUT_PASSWORD
}</code></pre>
* Response
<pre><code>HTTP status codes</code></pre>
## 회원 탈퇴
<pre><code>DELETE /users</code></pre>

## 개인 프로필 가져오기
<pre><code>GET /users/:name</code></pre>
* Request
<pre><code>{
    "token": UNIQUE_TOKEN
}</code></pre>
* Response
<pre><code>{
    "name": USER_NAME,
    "email": USER_EMAIL,
    "gender": USER_GENDER,
    "birthday": USER_BIRTHDAY,
    "intoroduce": USER_INTRODUCE,
    "potnt": USER_POINT
}</code></pre>
## 유저 프로필 가져오기
<pre><code>GET /users</code></pre>
* Request
<pre><code>none</code></pre>
* Response
<pre><code>{
    "name": USER_NAME,
    "email": USER_EMAIL,
    "gender": USER_GENDER,
    "birthday": USER_BIRTHDAY,
    "intoroduce": USER_INTRODUCE,
    "potnt": USER_POINT
}</code></pre>
## 개인 프로필 수정
<pre><code>POST /users</code></pre>
* Request
<pre><code>{
    "token": UNIQUE_TOKEN,
    "name": USER_NAME,
    "email": USER_EMAIL,
    "password": USER_PASSWORD,
    "gender": USER_GENDER,
    "birthday": USER_BIRTHDAY,
    "intoroduce": USER_INTRODUCE,
}</code></pre>
* Response
<pre><code>SUCCESS { "success": profile save }
FAIL    { "error": token invalid }</code></pre>
# 커뮤니티
## 글 작성
<pre><code>PUT /talk (not tested)</code></pre>
* Request
<pre><code>
header {
    x-access-token: USER_TOKEN
}
body {
    title: TITLE,
    content: CONTENT,
    game_id: GAME_ID(CATEGORY)
}
</code></pre>
* Response
<pre><code>
SUCCESS { success: true, message: 'post create'}
FAIL    { success: false, message: ERR_MESSAGE }
</code></pre>
## 글 가져오기
<pre><code>GET /talk</code></pre>
* Request
<pre><code>
query {
    post_id: index of posts         #optional, default = NaN -> search all posts
    game_id: categories of posts    #optional, default = NaN -> search all posts
}
</code></pre>
* Response
<pre><code>
SUCCESS JSON
FAIL    { success: false, message: ERR_MESSAGE }
</code></pre>
## 카테고리 글 가져오기
<pre><code>GET /talk</code></pre>
* Request
<pre><code>
query {
    game_id: GAME_ID
}
</code></pre>
* Response
<pre><code>
SUCCESS JSON
FAIL    { success: false, message: ERR_MESSAGE }
</code></pre>
## 인기 글 가져오기
<pre><code>GET /talk/popular</code></pre>
* Request
<pre><code>
query {
    posts: number of posts to show on one page  #optional, default = 10
    pages: posts of the nth page                #optional, default = 1
    game_id: categories of posts                #optional, default = NaN -> search all posts
}
</code></pre>
* Response
<pre><code>
SUCCESS JSON
FAIL    { success: false, message: ERR_MESSAGE }
</code></pre>
## 추천 글 가져오기
<pre><code>GET /talk/recommend</code></pre>
* Request
<pre><code></code></pre>
* Response
<pre><code></code></pre>
## 최신 글 가져오기
<pre><code>GET /talk/recent</code></pre>
* Request
<pre><code></code></pre>
* Response
<pre><code></code></pre>
## 글 수정
<pre><code>POST /talk (not tested)</code></pre>
* Request
<pre><code>
header {
    x-access-token: USER_TOKEN
}
body {
    id: POST_ID,
    title: FIXED_TITLE,
    content: FIXED_CONTENT
}
</code></pre>
* Response
<pre><code>
SUCCESS { success: true, message: 'post update'}
FAIL    { success: false, message: ERR_MESSAGE }
</code></pre>
## 글 삭제
<pre><code>DELETE /talk (not tested)</code></pre>
* Request
<pre><code>
header {
    x-access-token: USER_TOKEN
}
body {
    id = POST_ID
}
</code></pre>
* Response
<pre><code>
SUCCESS { success: true, message: 'post delete'}
FAIL    { success: false, message: ERR_MESSAGE }
</code></pre>
## 글 추천
<pre><code>POST /talk/recommend (not tested)</code></pre>
* Request
<pre><code>
header {
    x-access-token: USER_TOKEN
}
body {
    id: POST_ID
}
</code></pre>
* Response
<pre><code>
SUCCESS { success: true, message: 'recommend success'}
FAIL    { success: false, message: 'already recommend this post'}
</code></pre>
## 글 비추천
<pre><code>POST /talk/disrecommend (not tested)</code></pre>
* Request
<pre><code>
header {
    x-access-token: USER_TOKEN
}
body {
    id: POST_ID
}
</code></pre>
* Response
<pre><code>
SUCCESS { success: true, message: 'disrecommend success'}
FAIL    { success: false, message: 'already disrecommend this post'}
</code></pre>

# 게임
## 게임 추가
<pre><code>PUT /games</code></pre>
* Request
<pre><code></code></pre>
* Response
<pre><code></code></pre>
## 검색어로 게임 가져오기
<pre><code>GET /games/search/:query</code></pre>
* Request
<pre><code></code></pre>
* Response
<pre><code></code></pre>
## ID로 게임 가져오기
<pre><code>GET /games/:id</code></pre>
* Request
<pre><code></code></pre>
* Response
<pre><code></code></pre>
## 추천 게임 가져오기
<pre><code>GET /games/recommend</code></pre>
* Request
<pre><code></code></pre>
* Response
<pre><code></code></pre>
## 게임 수정
<pre><code>POST /games/:id</code></pre>
* Request
<pre><code></code></pre>
* Response
<pre><code></code></pre>
## 게임 삭제
<pre><code>DELETE /games/:id</code></pre>
* Request
<pre><code></code></pre>
* Response
<pre><code></code></pre>
# 댓글
## 게시판 댓글 달기
<pre><code></code></pre>
* Request
<pre><code></code></pre>
* Response
<pre><code></code></pre>
## 게시판 댓글 가져오기
<pre><code></code></pre>
* Request
<pre><code></code></pre>
* Response
<pre><code></code></pre>
## 게시판 댓글 수정
<pre><code></code></pre>
* Request
<pre><code></code></pre>
* Response
<pre><code></code></pre>
## 게시판 댓글 삭제
<pre><code></code></pre>
* Request
<pre><code></code></pre>
* Response
<pre><code></code></pre>
## 게임 댓글 달기
<pre><code></code></pre>
* Request
<pre><code></code></pre>
* Response
<pre><code></code></pre>
## 게임 댓글 가져오기
<pre><code></code></pre>
* Request
<pre><code></code></pre>
* Response
<pre><code></code></pre>
## 게임 댓글 수정
<pre><code></code></pre>
* Request
<pre><code></code></pre>
* Response
<pre><code></code></pre>
## 게임 댓글 삭제
<pre><code></code></pre>
* Request
<pre><code></code></pre>
* Response
<pre><code></code></pre>
# 태그
## 태그 가져오기
<pre><code>GET /tags</code></pre>
* Request
<pre><code></code></pre>
* Response
<pre><code></code></pre>
## 검색한 태그 가져오기
<pre><code>GET /tags?search=:STRING</code></pre>
* Request
<pre><code>none</code></pre>
* Response
<pre><code>[
    {"id":ID1, "value":VALUE1 },
    {"id":ID2, "value":VALUE2 },
    {"id":ID3, "value":VALUE3 },
    ...
]</code></pre>
## 게임 태그 가져오기(보류)
<pre><code>GET /tags?gameID=:ID</code></pre>
* Request
<pre><code>none</code></pre>
* Response
<pre><code>[
    {"id":ID1, "value":VALUE1 },
    {"id":ID2, "value":VALUE2 },
    {"id":ID3, "value":VALUE3 },
    ...
]</code></pre>


# 플랫폼
## 플랫폼 가져오기
<pre><code>GET /platforms</code></pre>
* Request
<pre><code>none</code></pre>
* Response
<pre><code>[
    {"id":ID1, "value":VALUE1 },
    {"id":ID2, "value":VALUE2 },
    {"id":ID3, "value":VALUE3 },
    ...
]</code></pre>
