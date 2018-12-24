const token = sessionStorage.getItem('token');
console.log(token);

if (!token) {
    alert('관리자 로그인이 필요합니다.')
    sessionStorage.setItem('prevUrl', window.location.href);
    window.location.href = '/manage/login'
}


fetch(`/games`)
.then(res => res.json())
.then(json => {
    json.games.forEach(game => {
        addGames(game);
    })
})

const addGames = (game) => {
    const container = document.createElement('article');
    container.classList.add('games');
    container.setAttribute('data-id', game.id);
    container.innerText = game.title;
    container.addEventListener('click', () => {
        window.location.href = `/manage/games/${game.id}`
    })
    const deleteButton = document.createElement('div');
    deleteButton.innerText = '삭제';
    container.appendChild(deleteButton);

    document.querySelector('section#main').appendChild(container);
}