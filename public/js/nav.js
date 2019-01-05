


const nav = document.createElement('nav');
nav.innerHTML = `
<ul>
    <li><a href="/manage"><b>GamePicker</b> Admin</a></li>
    <li><i class="fas fa-gamepad"></i><a href="/manage/games">Games Manage</a></li>
    <li><i class="fas fa-bell"></i><a href="/manage/push">Push Notification</a></li>
    <li><i class="fas fa-comments"></i><a href="/manage/reply">Q&A</a></li>
    <li><i class="fas fa-pen"></i><a href="/manage/working">Working logs</a></li>
    <li><i class="fas fa-exclamation-circle"></i><a href='/manage/notice'>Notice</a></li>
</ul>
`
document.addEventListener('DOMContentLoaded', () => {    
    const faLink = document.createElement('link');
    faLink.rel = "stylesheet";
    faLink.href = "https://use.fontawesome.com/releases/v5.6.3/css/all.css";
    faLink.integrity= "sha384-UHRtZLI+pbxtHCWp1t77Bi1L4ZtiqrqD80Kn4Z8NTSRyMA2Fd33n5dQ8lWUE00s/"
    faLink.crossOrigin = "anonymous"
    document.querySelector('head').appendChild(faLink);
    document.querySelector('body').prepend(nav);
})
