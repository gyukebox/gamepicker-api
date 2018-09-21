Gamepicker API 명세서
=====================

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

## 가입
<pre><code>PUT /users</code></pre>
* request
<pre><code>{
    "name": INPUT_NAME,
    "email": INPUT_EMAIL,
    "password": INPUT_PASSWORD
}</code></pre>
* Response
<pre><code>HTTP status codes</code></pre>

## 프로필
<pre><code>PUT /users/profile/:userName</code></pre>
* request
<pre><code>{
    
}</code></pre>
* Response
<pre><code>{
    blabla
}</code></pre>

#게임
## 추천게임 불러오기
<pre><code>GET /games/recommand</code><pre>