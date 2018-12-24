const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('../views/index.html')
})

router.get('/login', (req, res) => {
    res.render('../views/login.html')
})

router.get('/games', (req, res) => {
    res.render('../views/games.html')
})

router.get('/games/:id', (req, res) => {
    res.render('../views/gameDetail.html');
})

router.get('/push', (req, res) => {
    res.render('../views/push.html')
})

router.get('/working', (req, res) => {
    res.render('../views/working.html')
})

module.exports = router;