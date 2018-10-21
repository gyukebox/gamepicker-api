const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 3333;

app.use('/users', require('./routes/user'));
app.use('/games', require('./routes/game'));
app.use('/tags', require('./routes/tags'));
app.use('/platforms', require('./routes/platforms'));
app.use('/posts', require('./routes/posts'));

process.on('uncaughtException', function (err) {
    console.log(`!!! error !!!`)
    console.error(err);
    console.log(`!!! ----- !!!`)
});

app.get('/', (req, res) => {
    res.sendFile('./index.html', {root: __dirname});
});


app.listen(port);
