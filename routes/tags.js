const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const dbConfig = require('../config/db-config');

router.get('/',(req, res) => {
    const conn = mysql.createConnection(dbConfig);
    const query = `SELECT id, value FROM tags`;
    conn.query('SET NAMES utf8');
    conn.query(query, (err, rows) => {
        if(err)     res.status(400).json({ error: 'DATABASE error '});
        else        res.status(200).json(rows); 
    });
});

router.get('/search/:query', (req, res) => {
    console.log(req.params.query);
    const conn = mysql.createConnection(dbConfig);
    const query = `SELECT id, value FROM tags WHERE value LIKE '%${ req.params.query }%'`;
    conn.query('SET NAMES utf8');
    conn.query(query, (err, rows) => {
        if(err)     res.status(400).json({ error: 'DATABASE error ' + err});
        else        res.status(200).json(rows); 
    });
})

/*
router.get('/:gameid',(req, res) => {
    const conn = mysql.createConnection(dbConfig);
    const query = `SELECT id, value FROM tags`;
    conn.query('SET NAMES utf8');
    conn.query(query, (err, rows) => {
        if(err)     console.log(err);
        else        res.json(rows); 
    });
});
*/

module.exports = router;