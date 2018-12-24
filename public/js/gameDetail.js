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

    game.images.forEach(link => {
        renderImage(link)
    })

    game.videos.forEach(link => {
        renderVideo(link)
    })
}

const renderImage = (link) => {
    const img = document.createElement('img');
    img.src = link;
    document.querySelector(`article#images > .container`).prepend(img)
}

const renderVideo = (link) => {
    const iframe = document.createElement('iframe');
    iframe.setAttribute('frameborder',0);
    iframe.setAttribute('allow', 'autoplay; encrypted-media')
    iframe.setAttribute('allowfullscreen', null);        
    iframe.src = `https://www.youtube.com/embed/${link.split('/')[3]}`;
    document.querySelector(`article#videos > .container`).prepend(iframe)
}

const putGame = () => {

}

getGame().then(renderGame)

document.addEventListener('DOMContentLoaded',() => {
    document.querySelector(`#imageAdder`).addEventListener('click', ()=> {
        const link = prompt('이미지 링크를 입력해주세요');
        if (link)
            renderImage(link);
    })

    document.querySelector(`#videoAdder`).addEventListener('click', ()=> {
        const link = prompt('영상 링크를 입력해주세요');
        if (link)
            enderVideo(link);
    })
})