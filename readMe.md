Gamepicker API 명세서
=====================

# 회원
## 가입
<pre><code>POST /login</code></pre>
* request
<pre><code>
{
    "name": INPUT_NAME,
    "email": INPUT_EMAIL,
    "password": INPUT_PASSWORD
}
</code></pre>
* Response
<pre><code>
SUCCESS { "token": USER_TOKEN }
FAIL { "error": ERR_MESSAGE}
</code></pre>