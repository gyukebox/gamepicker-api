document.addEventListener('DOMContentLoaded', () => {    
    document.querySelector('div.button').addEventListener('click',() => {
        const email = document.querySelector('input#email').value;
        const password = document.querySelector('input#password').value;


        fetch('/auth/login?admin=1', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password,
                os_type: 'as'
            })
        }).then(res => {
            if (res.ok) {
                return res.json()
            } else {
                throw res
            } 
        })
        .then(json => {
            sessionStorage.setItem('token', json.token);
            const prevUrl = sessionStorage.getItem('prevUrl');
            window.location.href = prevUrl?prevUrl:'/manage'
        }).catch(err => {
            err.json().then(json => {
                alert(json.message)
            })
        })
    })
})