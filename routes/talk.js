/*
GET /:categoryName
GET /:category/:postID

PUT /:category/postID
GET /:category/:postID
DELETE /:category/:postID
UPDATE /:category/:postID

GET /:category/
 */

const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const dbConfig = require('../config/db-config');

router.put('/', (req, res) => {
    const query = `INSERT user_id, title, content, game_id, views, `
})

router.get('/:id', (req, res) => {
    const query = `SELECT id, title, content, recommend, disrecommend
                    FROM posts WHERE id=${req.params.id}`
});

module.exports = router;