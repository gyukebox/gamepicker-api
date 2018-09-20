Gamepicker API 명세서
=====================
# 목차
1. [회원]
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
4. 태그
    - [태그 가져오기](#태그-가져오기)
5. 플랫폼
    - [플랫폼 가져오기](#플랫폼-가져오기)

# 회원
## 로그인
<pre><code>POST /login</code></pre>
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
<pre><code>GET /users/profile/:name</code></pre>
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
<pre><code>GET /users/profile</code></pre>
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
<pre><code>POST /users/profile</code></pre>
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
<pre><code>PUT /talk/write</code></pre>
## 인기 글 가져오기
<pre><code>GET /talk/:postID</code></pre>
## 추천 글 가져오기
<pre><code>GET /talk/:postID</code></pre>
## 최신 글 가져오기
<pre><code>GET /talk/:postID</code></pre>
## 글 수정
<pre><code>POST /talk/:postID</code></pre>
## 글 삭제
<pre><code>DELETE /talk/:postID</code></pre>
## 글 추천
<pre><code>POST /talk/:postID/recommend</code></pre>
## 글 비추천
<pre><code>POST /talk/:postID/disrecommend</code></pre>

# 게임
## 게임 추가
<pre><code>GET /games</code></pre>
## 검색어로 게임 가져오기
<pre><code>GET /games?query=':query'</code></pre>
## ID로 게임 가져오기
<pre><code>GET /games/:gameID</code></pre>
## 추천 게임 가져오기
<pre><code>GET /games/recommend</code></pre>
## 게임 수정
<pre><code>POST /games/:gameID</code></pre>
## 게임 삭제
<pre><code>DELETE /games/:gameID</code></pre>

# 태그
## 태그 가져오기
<pre><code>GET /tags</code></pre>

# 플랫폼
## 플랫폼 가져오기
<pre><code>GET /platforms</code></pre>


