const token = sessionStorage.getItem('token');
if (!token) {
    alert('관리자 로그인이 필요합니다.')
    sessionStorage.setItem('prevUrl', window.location.href);
    window.location.href = '/manage/login'
}