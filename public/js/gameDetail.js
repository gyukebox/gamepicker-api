let game;

const getGame = () => new Promise((resolve, reject) => {
    const gameId = window.location.pathname.split('/')[3];
    fetch(`/games/${gameId}`)
    .then(res => {
        if (res.ok) {
            return res.json()
        } else {
            throw res
        }
    })
    .then(json => {
        game = json.game;
        resolve()        
    }).catch(err => {
        err.json().then(json => {
            reject(json.message)
        })
    })
})


const renderGame = () => {
    const keyList = ['title', 'developer', 'publisher', 'age_rate', 'summary'];
    keyList.forEach(key => {
        console.log(game[key]);
        document.querySelector(`article#${key} > input`).value = game[key];
    })

    console.log(game.images);
    
    game.images.forEach(image => {
        const img = document.createElement('img');
        img.src = image;
        document.querySelector(`article#images > .container`).prepend(img)
    })

    game.videos.forEach(link => {
        const iframe = document.createElement('iframe');
        iframe.setAttribute('frameborder',0);
        iframe.setAttribute('allow', 'autoplay; encrypted-media')
        iframe.setAttribute('allowfullscreen', null);
        console.log(link.split('/')[3]);
        
        iframe.src = `https://www.youtube.com/embed/${link.split('/')[3]}`;
        document.querySelector(`article#videos > .container`).prepend(iframe)
    })
}

const putGame = () => {

}

getGame().then(renderGame)