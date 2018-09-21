const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const dbConfig = require('../config/db-config');

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

module.exports = router;