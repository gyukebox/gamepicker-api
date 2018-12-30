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
    const keyList = ['title', 'developer', 'publisher', 'age_rate'];
    keyList.forEach(key => {
        document.querySelector(`article#${key} > input`).value = game[key];
    })

    document.querySelector(`article#summary > textarea`).value = game.summary

    const tagContainer = document.querySelector('#tags > .container > ul');
    game.tags.forEach(value => {
        const li = document.createElement('li');
        li.textContent = value;
        tagContainer.appendChild(li);
    })

    const platformContainer = document.querySelector('#platforms > .container > ul');
    game.platforms.forEach(value => {
        const li = document.createElement('li');
        li.textContent = value;
        platformContainer.appendChild(li);
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

const renderTags = (value) => {
    const container = document.querySelector('#tags > .container');
    
}

const renderPlatforms = (value) => {

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