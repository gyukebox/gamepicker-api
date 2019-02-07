const headers = new Headers();
headers.append('authorization', 'w6mgLXNHbPgewJtRESxh');

const token = sessionStorage.getItem('token');
if (token)
    headers.append('x-access-token', token);

fetch(`/games?sort=rated`, { headers })
.then(res => res.json())
.then(json => {
    console.log(json);
    
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

    document.querySelector('#game-list').appendChild(container);
}

document.addEventListener('DOMContentLoaded', () => {    
    document.querySelector('input').addEventListener('keyup', (e) => {
        const value = document.querySelector('input').value;
        document.querySelectorAll('.games').forEach(game => {
            game.style.display = 'inherit'
            if (!game.innerText.toLowerCase().includes(value) && game.innerText) {
                game.style.display = 'none'
            }
        })
    })
})
