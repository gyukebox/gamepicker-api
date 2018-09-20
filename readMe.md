Gamepicker API 명세서
=====================
#목차
1. 회원
2. 커뮤니티
3. 게임
4. 태그
5. 플랫폼

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

## 프로필 불러오기
### 개인 프로필 불러오기
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
### 유저 프로필 불러오기
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
## 유저 정보 수정
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
## 글 읽기
### 인기 글 읽기
<pre><code>GET /talk/:postID</code></pre>
### 추천 글 읽기
<pre><code>GET /talk/:postID</code></pre>
### 최신 글 읽기
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
## 게임 읽기
### 특정 게임 읽기1
<pre><code>GET /games?query=':query'</code></pre>
### 특정 게임 읽기2
<pre><code>GET /games/:gameID</code></pre>
### 추천 게임 읽기
<pre><code>GET /games/recommend</code></pre>
## 게임 수정
<pre><code>POST /games/:gameID</code></pre>
## 게임 삭제
<pre><code>DELETE /games/:gameID</code></pre>

# 태그
## 태그 읽기
<pre><code>GET /tags</code></pre>

# 플랫폼
## 플랫폼 읽기
<pre><code>GET /platforms</code></pre>


