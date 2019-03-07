const headers = new Headers();
headers.append('authorization', 'w6mgLXNHbPgewJtRESxh');

const getGame = () => new Promise((resolve, reject) => {
    const gameId = window.location.pathname.split('/')[3];
    fetch(`/games/${gameId}`, { headers })
    .then(res => {
        if (res.ok) {
            return res.json()
        } else {
            throw res
        }
    })
    .then(json => {
        resolve(json.game)        
    }).catch(err => {
        err.json().then(json => {
            reject(json.message)
        })
    })
})

const getPlatforms = () => new Promise((resolve, reject) => {
    fetch(`/platforms`, { headers })
    .then(res => res.json())
    .then(json => {
        const container = document.querySelector('#platforms');
        json.platforms.forEach(platform => {
            const div = document.createElement('div');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = 'platform_' + platform.value;
            checkbox.value = platform.id;
            const label = document.createElement('label');
            label.setAttribute('for', 'platform_'+platform.value);
            label.textContent = platform.value;
            div.appendChild(checkbox);
            div.appendChild(label);
            container.appendChild(div);
        });
        resolve();
    }).catch(reject);
})

const getUserFeatures = () => new Promise((resolve, reject) => {
    const game_id = window.location.pathname.split('/')[3];
    headers.append('x-access-token', sessionStorage.getItem('token'))
    fetch(`/games/${game_id}/features`, { headers }).then(res => {
        if (!res.ok)
            throw res;
        return res.json();
    }).then(json => {
        resolve(json.feature)
        
    }).catch(err => {
        err.json().then(reject)
    })
})

const renderFeatures = async () => {
    const score = await getUserFeatures();
    const features = [ '게임성', '조작성', '난이도', '스토리', '몰입도', 'BGM', '공포성', '과금유도', '노가다성', '진입장벽', '필요성능', '플레이타임', '가격', 'DLC', '버그', '그래픽' ];
    const tbody = document.querySelector('table.select > tbody');
    features.forEach(feature => {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.textContent = feature;
        tr.appendChild(td);
        for (let i=0; i<6; i++) {
            const td = document.createElement('td');
            const input = document.createElement('input');
            input.type = 'radio';
            input.id = feature + '_opt_' + i;
            input.name = feature;
            input.dataset.score = i;
            const label = document.createElement('label');
            label.setAttribute('for', feature + '_opt_' + i);
            label.textContent = i;
            if (score && score[feature] === i) {
                input.checked = true;
            }
            td.appendChild(input);
            td.appendChild(label);
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    });
}

const renderGame = async (game) => {    
    const keyList = ['title', 'developer', 'publisher'];
    keyList.forEach(key => {
        document.querySelector(`article#${key} > input`).value = game[key];
    })

    document.querySelector('article#age_rate > select').value = game.age_rate;

    document.querySelector(`article#summary > textarea`).value = game.summary

    await getPlatforms();
    const platformButtons = document.querySelectorAll('#platforms input[type="checkbox"]');    
    platformButtons.forEach(btn => {
        const name = btn.id.split('_')[1];
        if (game.platforms.includes(name)) {
            btn.setAttribute('checked', true);
        }
        
    })

    game.images.forEach(link => {
        renderImage(link);
    })

    game.videos.forEach(link => {
        renderVideo(link);
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

getGame().then(renderGame);

document.addEventListener('DOMContentLoaded',() => {
    renderFeatures();
    document.querySelector(`#imageAdder`).addEventListener('click', ()=> {
        const link = prompt('이미지 링크를 입력해주세요');
        if (link)
            renderImage(link);
    })

    document.querySelector(`#videoAdder`).addEventListener('click', ()=> {
        const link = prompt('영상 링크를 입력해주세요');
        if (link)
            renderVideo(link);
    })

    document.querySelector('#game-update').addEventListener('click', async () => {
        const game_id = Number(window.location.pathname.split('/')[3]);
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'x-access-token': sessionStorage.getItem('token'),
            'authorization': 'w6mgLXNHbPgewJtRESxh'
        }        
        const result = {
            title: document.querySelector('#title input').value,
            developer: document.querySelector('#developer input').value,
            publisher: document.querySelector('#publisher input').value,
            age_rate: document.querySelector('#age_rate select').value,
            summary: document.querySelector('#summary textarea').value,
            platforms: Array.from(document.querySelectorAll('#platforms input[type="checkbox"]:checked')).map(node => node.value),
            images: Array.from(document.querySelectorAll('#images img')).map(image => image.src),
            videos: Array.from(document.querySelectorAll('#videos iframe')).map(video => video.src)
        }
        try {
            let res;
            /*
            res = await fetch(`/games/${game_id}`, {
                headers: headers,
                method: 'PUT',
                body: JSON.stringify(result)
            });
            if (!res.ok)
                throw res;
            */
            res = await fetch(`/games/${game_id}/features`, {
                headers, headers,
                method: 'POST',
                body: JSON.stringify(getFeatures())
            });
            if (!res.ok)
                throw res;
            alert('수정 완료!');
            location.replace('/manage/games')
        } catch (err) {
            if (typeof err.json === 'function')
                err.json().then(console.error);
            else
                console.error(err);
            alert('Error! Please contact the developer')
        }
    })
})

const getFeatures = () => {
    const features = [ '게임성', '조작성', '난이도', '스토리', '몰입도', 'BGM', '공포성', '과금유도', '노가다성', '진입장벽', '필요성능', '플레이타임', '가격', 'DLC', '버그', '그래픽' ];
    const features_score = {};
    features.forEach(feature => {
        const checked = document.querySelector(`#features input[name='${feature}']:checked`);        
        features_score[feature] = checked?Number(checked.dataset.score):0;
    });
    return features_score;
}