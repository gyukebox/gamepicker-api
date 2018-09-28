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

const jwt = require('jwt-simple');
const config = require('../config/jwt-config');

const Database = require('../model/Database');
const database = new Database();

router.put('/', (req, res) => {
    const token = req.headers['x-access-token'];
    if(!token)
        return res.status(401).json({ success: false, message: 'not logged in'});
    const user_id = jwt.decode(token, config.jwtSecret);
    const { title, content, game_id } = req.body;

    const query = `INSERT INTO posts(user_id, title, content, game_id) VALUES ( ${user_id}, ${title}, ${content}, ${game_id} )`;
    database.query(query)
    .then(() => res.status(201).json({ success: true, message: 'post create'}))
    .catch(err => res.status(400).json({ success: false, message: err }));
})

router.get('/', (req, res) => {
    const { game_id, post_id } = req.query;
    if (game_id && post_id ) {
        const query = `SELECT id, title, content, recommend, disrecommend FROM posts WHERE game_id=${game_id} AND id=${post_id}`;
        database.query(query)
        .then(rows => res.status(200).json(rows))
        .then(() => { return database.query(`UPDATE posts SET views = views + 1 WHERE game_id=${game_id} AND id=${post_id}`); })
        .catch(err => res.status(400).json({ success: false, message: err }));
    } else if (post_id) {   
        const query = `SELECT id, title, content, recommend, disrecommend FROM posts WHERE id=${post_id}`;
        database.query(query)
        .then(rows => res.status(200).json(rows[0]))
        .then(() => { return database.query(`UPDATE posts SET views = views + 1 WHERE id = ${post_id}`); })
        .catch(err => res.status(400).json({ success: false, message: err }));
    } else if (game_id) {
        const query = `SELECT id, title, content, recommend, disrecommend FROM posts WHERE game_id=${game_id}`;
        database.query(query)
        .then(rows => res.status(200).json(rows))
        .then(() => { return database.query(`UPDATE posts SET views = views + 1 WHERE game_id = ${game_id}`); })
        .catch(err => res.status(400).json({ success: false, message: err }));
    } else {
        res.status(400).json({ success: false, message: 'url query not included' });
    }
});

router.post('/', (req, res) => {
    const token = req.headers['x-access-token'];
    if(!token)
        return res.status(401).json({ success: false, message: 'not logged in'});
    const { id, title, content } = req.body;
    if(id != jwt.decode(token, config.jwtSession))
        return res.status(401).json({ success: false, message: 'unauthenticated' })
    const query = `UPDATE posts SET title = ${title} content = ${content} WHERE id = ${id}`;
    database.query(query)
    .then(() => res.status(201).json({ success: true, message: 'post update'}))
    .catch(err => res.status(400).json({ success: false, message: err }));
})

router.delete('/', (req, res) => {
    const token = req.headers['x-access-token'];
    if(!token)
        return res.status(401).json({ success: false, message: 'not logged in'});
    const { id } = req.body.id;
    if(id != jwt.decode(token, config.jwtSession))
        return res.status(401).json({ success: false, message: 'unauthenticated' })
    const query = `DELETE FROM posts WHERE id = ${id}`;
    database.query(query)
    .then(() => res.status(200).json({ success: true, message: 'post delete'}))
    .catch(err => res.status(400).json({ success: false, message: err }));
})

module.exports = router;