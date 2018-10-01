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

const authToken = (token, id) => {
    if (!token)
        return { success: false, message: 'Token does not exist'}
    if(!id)
        return { success: true, id: jwt.decode(token, config.jwtSession)}
    if(id === jwt.decode(token, config.jwtSession))
        return { success: false, message: 'Authentication failed'}
    return { success: true }
}

router.put('/', (req, res) => {
    const token = req.headers['x-access-token'];
    if(!token)
        return res.status(401).json({ success: false, message: 'not logged in'});
    const user_id = jwt.decode(token, config.jwtSecret);
    const { title, content } = req.body;
    const game_id = req.body.game_id || 0;

    const query = `INSERT INTO posts(user_id, title, content, game_id) VALUES ( ${user_id}, ${title}, ${content}, ${game_id} )`;
    database.query(query)
    .then(() => res.status(201).json({ success: true }))
    .catch(err => res.status(400).json({ success: false, message: err }));
})

router.get('/', (req, res) => {
    const { game_id, post_id, sort } = req.query;
    const count_per_page = req.query.posts || 10;
    const page_number = req.query.pages || 1;
    let query = `SELECT id, title, content, recommend, disrecommend FROM posts `;
    if (game_id && post_id) {
        query  += `WHERE game_id=${game_id} AND id=${post_id}`;
    } else if (game_id) {
        query += `WHERE game_id=${game_id}`;
    } else if( post_id ) {
        query += `WHERE post_id=${post_id}`;
    }
    switch (sort) {
        case 'popular':
            query += `ORDER BY views ASC `
            break;
        case 'recommend' :
            query += `ORDER BY recommend ASC `;
            break;
        case 'recent' :
            query += `ORDER BY update_date ASC `;
            break;
        default:
            res.status(400).json({ success: false, message: 'check your sort option'})
            break;
    }
    query += `LIMIT ${(page_number-1) * count_per_page},${count_per_page}`;
    database.query(query)
    .then(rows => {
        res.status(200).json({ success: true, posts: rows});
        return rows;
    })
    .then(rows => {
        const id_list = [];
        rows.forEach(row => id_list.push(row.id));
        return database.query(`UPDATE posts SET views = views + 1 WHERE id IN (${id_list.toString()})`);
    })
    .catch(err => res.status(400).json({ success: false, message: err }));
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
    .then(() => res.status(201).json({ success: true }))
    .catch(err => res.status(400).json({ success: false, message: err }));
})

router.delete('/', (req, res) => {
    const token = req.headers['x-access-token'];
    if(!token)
        return res.status(401).json({ success: false, message: 'not logged in'});
    const id = req.body.id;
    const user_id = jwt.decode(token, config.jwtSession);
    if(id != user_id)
        return res.status(401).json({ success: false, message: 'unauthenticated' })
    const query = `DELETE FROM posts WHERE user_id = ${user_id} AND id = ${id}`;
    database.query(query)
    .then(() => res.status(200).json({ success: true }))
    .catch(err => res.status(400).json({ success: false, message: err }));
})

router.post('/recommend', (req, res) => {
    const token = req.headers['x-access-token'];
    if(!token)
        return res.status(401).json({ success: false, message: 'not logged in'});
    const user_id = jwt.decode(token, config.jwtSecret);
    const { id } = req.body;

    database.query(`SELECT EXISTS (SELECT * FROM recommends WHERE post_id = ${id} AND user_id = ${user_id}) as success`)
    .then(rows => {
        if (rows[0].success)
            return database.query(`DELETE FROM recommends WHERE post_id = ${id} AND user_id = ${user_id}`);
        else
            return database.query(`INSERT INTO recommends (post_id, user_id) VALUES (${id}, ${user_id}) `);
    })
    .then(() => {
        res.status(200).json({ success: true })
    })
    .catch(err => res.status(400).json({ success: false, message: err }))
});

router.post('/disrecommend', (req, res) => {
    const token = req.headers['x-access-token'];
    if(!token)
        return res.status(401).json({ success: false, message: 'not logged in'});
    const user_id = jwt.decode(token, config.jwtSecret);
    const { id } = req.body;

    database.query(`SELECT EXISTS (SELECT * FROM disrecommends WHERE post_id = ${id} AND user_id = ${user_id}) as success`)
    .then(rows => {
        if ( rows.success == 1 )    res.status(406).json({ success: false, message: 'already disrecommend this post'})
        else                        res.status(201).json({ success: true, message: 'disrecommend success'})
    })
    .catch(err => res.status(400).json({ success: false, message: err }))
});

module.exports = router;