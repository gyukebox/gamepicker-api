const createGame = () => {
    const game = {
        title: getValue('title'),
        developer: getValue('developer'),
        publisher: getValue('publisher'),
        age_rate: getValue('age_rate'),
        summary: document.querySelector('#summary > textarea').value
    }
    console.log(game);
    
}

const getValue = (key) => document.querySelector(`#${key} > input`).value;

const addImages = () => {
    const container = document.querySelector('#images > .container');
    const link = prompt('이미지 링크를 입력해주세요');
    if (link) {
        const deleteBtn = document.createElement('div');
        const div = document.createElement('div');
        deleteBtn.textContent = 'Delete'
        deleteBtn.classList.add('deleteButton');
        div.appendChild(deleteBtn);
        deleteBtn.addEventListener('click', () => {
            container.removeChild(div);
        })
        const img = document.createElement('img');
        img.src = link;
        div.appendChild(img);
        container.appendChild(div);
    }
}

const addVideos = () => {
    const container = document.querySelector('#videos > .container');
    const link = prompt('유튜브 링크를 입력해주세요');
    if (link) {
        const deleteBtn = document.createElement('div');
        const div = document.createElement('div');
        deleteBtn.textContent = 'Delete'
        deleteBtn.classList.add('deleteButton');
        div.appendChild(deleteBtn);
        deleteBtn.addEventListener('click', () => {
            container.removeChild(div);
        })
        const iframe = document.createElement('iframe');
        iframe.setAttribute('frameborder',0);
        iframe.setAttribute('allow', 'autoplay; encrypted-media')
        iframe.setAttribute('allowfullscreen', null);        
        iframe.src = `https://www.youtube.com/embed/${link.split('/')[3]}`;
        div.appendChild(iframe);
        container.appendChild(div);
    }
}

const addTags = () => {

}

const addPlatforms = () => {

}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#images > .addButton').addEventListener('click', () => {
        addImages();
    })
    document.querySelector('#videos > .addButton').addEventListener('click', () => {
        addVideos();
    })
    document.querySelector('input#create').addEventListener('click', () => {
        createGame();
    })
})