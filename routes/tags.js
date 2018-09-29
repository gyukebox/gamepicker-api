const express = require('express');
const router = express.Router();

const DATABASE = require('../model/Database');
const database = DATABASE();

router.get('/',(req, res) => {
    const conn = mysql.createConnection(dbConfig);
    conn.query('SET NAMES utf8');
    if(req.query.search) {
        const query = `SELECT id, value FROM tags WHERE value LIKE '%${ req.query.search }%'`;
        conn.query(query, (err, rows) => {
            if(err)     res.status(400).json({ error: 'DATABASE error' });
            else        res.status(200).json(rows); 
        });
    } /*else if (req.query.gameID) {
        const query = `SELECT id, value FROM game_tags WHERE game_id=${ req.query.search }`;
        conn.query(query, (err, rows) => {
            return new promise((resolve. reject))
            if(err)     res.status(400).json({ error: 'DATABASE error' });
            else        res.status(200).json(rows); 
        });
    }*/ else {
        const query = `SELECT id, value FROM tags`;
        conn.query(query, (err, rows) => {
            if(err)     res.status(400).json({ error: 'DATABASE error'});
            else        res.status(200).json(rows); 
        });
    }
});

router.put('/', (req, res) => {
    const { value } = req.body;
    if (!value)
        return res.status(400).json({ success: false, message: 'body.value is required' })
    database.query(`INSERT INTO tags (value) VALUES (${value})`)
    .then(() => res.status(201).json({ success: true }))
    .catch(err => res.status(400).json({ success: false, message: false }))
})

module.exports = router;