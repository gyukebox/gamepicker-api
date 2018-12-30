fetch(`/admin/questions`)
.then(rows => rows.json())
.then(json => {
    const tbody = document.querySelector('tbody');
    console.log(tbody);
    const questions = json.questions;
    document.querySelector('#question > input').value = questions[0].title;
    document.querySelector('#question > textarea').value = questions[0].value;
}).catch(console.error)